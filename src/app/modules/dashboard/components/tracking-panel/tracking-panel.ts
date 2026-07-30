import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  Signal,
  viewChild,
  ViewChild,
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
import { HttpClientService } from '../../services/http-client';
import { Vehicle, VehicleState } from '../../models/fleet';
import { Vector } from 'ol/source';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import { Circle, Fill, Stroke, Style, Text } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import { Select } from 'ol/interaction';
import { click } from 'ol/events/condition';
import { inAndOut } from 'ol/easing';

interface StateMeta {
  label: string;
  ring: string;
  badge: string;
}
const STATE: Record<VehicleState, StateMeta> = {
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
export class TrackingPanelComponent {
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private httpClientService: HttpClientService = inject(HttpClientService);

  search = '';
  stateFilter: string = '';

  selected: Vehicle | null = null;

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
  mapContainer: Signal<HTMLDivElement> = viewChild.required('mapContainer');
  dataSource: MatTableDataSource<Vehicle> = new MatTableDataSource<Vehicle>();

  vehicles: Vehicle[] = [];

  ngAfterViewInit(): void {
    this.initMap();
    this.updateDataSource();
    setInterval(() => {
      this.updateDataSource();
    }, 1000);
    this.connectDataSource();
  }
  connectDataSource() {
    this.dataSource.connect().subscribe((rows) => {
      this.vehicles = rows;
      this.cdr.markForCheck();
    });
  }
  updateDataSource() {
    this.httpClientService.getFleet().subscribe((data) => {
      this.dataSource.data = data;
      this.applyFilter(this.search);

      this.syncMapWithVehicles();
    });
  }
  initMap() {
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
      style: this.vehicleStyle,
    });
    this.map = new Map({
      target: 'map-container',
      layers: [new TileLayer({ source: new OSM() }), this.vectorLayer],
      view: this.mapView,
    });
    const select = new Select({
      layers: [this.vectorLayer],
      condition: click,
    });
    this.map.addInteraction(select);

    select.on('select', (e) => {
      if (e.selected.length > 0) {
        this.open(e.selected[0].get('vehicleData'));
      }
    });
  }

  syncMapWithVehicles() {
    if (!this.vectorSource) return;

    this.vehicles.forEach((vehicle) => {
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

    const currentVehicleIds = new Set(this.vehicles.map((v) => v.id));
    this.vectorSource.getFeatures().forEach((feature) => {
      if (!currentVehicleIds.has(feature.getId() as string)) {
        this.vectorSource.removeFeature(feature);
      }
    });
  }
  applyFilter(query: string) {
    const trimmedQuery = query.trim().toLowerCase();
    if (
      trimmedQuery === 'moving' ||
      trimmedQuery === 'stopped' ||
      trimmedQuery === 'disconnected'
    ) {
      this.stateFilter = query;
    } else {
      this.stateFilter = '';
    }

    this.dataSource.filter = trimmedQuery;
  }
  applyStateFilter(state: VehicleState) {
    this.stateFilter = state;
    this.search = this.stateFilter;
    this.applyFilter(state);
  }

  labelOf(s: VehicleState) {
    return STATE[s].label;
  }

  ringOf(s: VehicleState) {
    return STATE[s].ring;
  }
  iconOf(vehicle: Vehicle) {
    return vehicle.type.includes('سواری') ? 'directions_car' : 'local_shipping';
  }
  badgeOf(s: VehicleState) {
    return STATE[s].badge;
  }

  open(vehicle: Vehicle) {
    this.map.getView().animate({
      center: fromLonLat([vehicle.location.longitude, vehicle.location.latitude]),
      zoom: 13,
      duration: 250,
      easing: inAndOut,
    });
    this.selected = vehicle;
  }
  close() {
    this.selected = null;
  }

  trackById = (_: number, vehicle: Vehicle) => vehicle.id;
}
