import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  Signal,
  viewChild,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import { MatTableDataSource } from '@angular/material/table';
import { Vehicle, VehicleState } from '../../models/fleet';
import { Vector } from 'ol/source';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import { Circle, Fill, Stroke, Style, Text } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import { Select } from 'ol/interaction';
import { click } from 'ol/events/condition';
import { inAndOut } from 'ol/easing';
import { FleetService } from '../../services/fleet.service';
import { interval, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface StateMeta {
  label: string;
  ring: string;
  badge: string;
}
const VEHICLE_STATE_META: Record<VehicleState, StateMeta> = {
  moving: { label: 'درحال حرکت', badge: 'st-moving', ring: '#13a89a' },
  disconnected: { label: 'قطع', badge: 'st-disconnected', ring: '#e0533d' },
  stopped: { label: 'متوقف', badge: 'st-stopped', ring: '#d99413' },
};

@Component({
  selector: 'app-tracking-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
  ],
  templateUrl: './tracking-panel.html',
  styleUrls: ['./tracking-panel.scss'],
})
export class TrackingPanelComponent implements OnDestroy, AfterViewInit {
  private fleetService = inject(FleetService);

  search = '';
  stateFilter: string = '';

  selected: WritableSignal<Vehicle | null> = signal(null);
  vehicleStateMeta = VEHICLE_STATE_META;

  vehicles = signal<Vehicle[]>([]);
  filteredVehicles = computed(() => {
    const query = this.search.trim().toLowerCase();
    const state = this.stateFilter;

    return this.vehicles().filter((vehicle) => {
      const matchesSearch =
        !query ||
        vehicle.id.toLowerCase().includes(query) ||
        vehicle.plate.toLowerCase().includes(query) ||
        vehicle.organization.toLowerCase().includes(query) ||
        vehicle.type.toLowerCase().includes(query) ||
        vehicle.usage.toLowerCase().includes(query);

      const matchesState = !state || vehicle.state === state;

      return matchesSearch && matchesState;
    });
  });

  // OpenLayers stuff:
  private map!: Map;
  mapView = new View({
    center: fromLonLat([52.5837, 29.5918]),
    zoom: 12,
  });
  vehicleStyle = new Style({
    image: new Circle({
      radius: 14,
      fill: new Fill({ color: '#2563eb' }),
      stroke: new Stroke({ color: '#ffffff', width: 2 }),
    }),
    text: new Text({
      text: '🚚',
      font: '16px Arial',
      fill: new Fill({ color: '#ffffff' }),
    }),
  });
  vectorSource = new Vector();
  vectorLayer!: VectorLayer;
  mapSelect!: Select;
  mapContainer = viewChild.required<ElementRef<HTMLDivElement>>('map');

  constructor() {
    this.updateData();
    interval(2000)
      .pipe(startWith(0), takeUntilDestroyed())
      .subscribe(() => {
        this.updateData();
      });
  }
  ngAfterViewInit(): void {
    this.initMap();
  }

  updateData() {
    this.fleetService.getFleet().subscribe((data) => {
      this.vehicles.set(data);
      this.syncMapWithVehicles(data);
    });
  }
  initMap() {
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
      style: this.vehicleStyle,
    });
    this.map = new Map({
      target: this.mapContainer().nativeElement,
      layers: [new TileLayer({ source: new OSM() }), this.vectorLayer],
      view: this.mapView,
    });
    this.mapSelect = new Select({
      layers: [this.vectorLayer],
      condition: click,
    });
    this.map.addInteraction(this.mapSelect);

    this.mapSelect.on('select', (e) => {
      if (e.selected.length > 0) {
        this.selectVehicle(e.selected[0].get('vehicleData'));
      }
    });
  }

  syncMapWithVehicles(vehicles: Vehicle[]) {
    if (!this.vectorSource) return;

    vehicles.forEach((vehicle) => {
      const existingFeature = this.vectorSource.getFeatureById(vehicle.id);
      const newCoordinate = fromLonLat([vehicle.location.longitude, vehicle.location.latitude]);

      if (existingFeature) {
        (existingFeature.getGeometry() as Point).setCoordinates(newCoordinate);
        existingFeature.set('vehicleData', vehicle);
      } else {
        const feature = new Feature({
          geometry: new Point(newCoordinate),
          vehicleData: vehicle,
        });
        feature.setId(vehicle.id);
        this.vectorSource.addFeature(feature);
      }
    });

    const currentVehicleIds = new Set(this.vehicles().map((v) => v.id));
    this.vectorSource.getFeatures().forEach((feature) => {
      if (!currentVehicleIds.has(feature.getId() as string)) {
        this.vectorSource.removeFeature(feature);
      }
    });
  }

  iconOf(vehicle: Vehicle) {
    return 'directions_car';
  }

  selectVehicle(vehicle: Vehicle) {
    // cleanup previous selections
    this.deselectVehicle();
    this.selected.set(vehicle);

    this.map.getView().animate({
      center: fromLonLat([vehicle.location.longitude, vehicle.location.latitude]),
      zoom: 13,
      duration: 250,
      easing: inAndOut,
    });
  }
  deselectVehicle() {
    this.selected.set(null);
  }

  ngOnDestroy() {
    this.map?.setTarget(undefined);
  }
}
