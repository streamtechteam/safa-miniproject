import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Feature, Map, View } from 'ol';
import { Point } from 'ol/geom';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { fromLonLat, toLonLat } from 'ol/proj';
import type { Coordinate } from 'ol/coordinate';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { GeoPoint } from '../../../models/fleet';

const DEFAULT_CENTER: GeoPoint = { latitude: 32.4279, longitude: 53.688 }; // iran
const DEFAULT_ZOOM = 5;
const EDIT_ZOOM = 14;

@Component({
  selector: 'app-geo-picker-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './geo-picker-dialog.html',
  styleUrls: ['./geo-picker-dialog.scss'],
})
export class GeoPickerDialogComponent implements AfterViewInit, OnDestroy {
  selected: WritableSignal<GeoPoint | null> = signal(null);

  private map!: Map;
  private readonly marker = new Feature<Point>();
  private readonly initial: GeoPoint | null = inject(MAT_DIALOG_DATA);
  mapContainer = viewChild.required<ElementRef<HTMLDivElement>>('map');
  dialogRef: MatDialogRef<GeoPickerDialogComponent, GeoPoint | null> = inject(MatDialogRef);

  ngAfterViewInit(): void {
    const markerLayer = new VectorLayer({
      source: new VectorSource({ features: [this.marker] }),
      style: new Style({
        image: new CircleStyle({
          radius: 8,
          fill: new Fill({ color: '#1a73e8' }),
          stroke: new Stroke({ color: '#ffffff', width: 3 }),
        }),
      }),
    });

    const start: GeoPoint = this.initial ?? DEFAULT_CENTER;

    this.map = new Map({
      target: this.mapContainer().nativeElement,
      layers: [new TileLayer({ source: new OSM() }), markerLayer],
      view: new View({
        center: fromLonLat([start.longitude, start.latitude]),
        zoom: this.initial ? EDIT_ZOOM : DEFAULT_ZOOM,
      }),
    });

    this.map.on('singleclick', (e) => this.selectLocation(e.coordinate));
    if (this.initial) {
      this.selectLocation(fromLonLat([this.initial.longitude, this.initial.latitude]));
    }

    this.dialogRef.afterOpened().subscribe(() => this.map.updateSize());
  }

  ngOnDestroy(): void {
    this.map?.setTarget(undefined);
  }

  confirm(): void {
    if (this.selected()) {
      this.dialogRef.close(this.selected());
    }
  }
  cancel(): void {
    this.dialogRef.close(null);
  }
  private selectLocation(coordinate: Coordinate): void {
    this.marker.setGeometry(new Point(coordinate));
    const [longitude, latitude] = toLonLat(coordinate);
    this.selected.set({ latitude, longitude });
  }
}
