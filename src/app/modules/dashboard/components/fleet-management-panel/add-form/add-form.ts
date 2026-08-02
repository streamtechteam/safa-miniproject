import { Component, inject, output, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GeoPoint, Vehicle, VehicleState } from '../../../models/fleet';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { GeoPickerDialogComponent } from '../geo-picker-dialog/geo-picker-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FleetService } from '../../../services/fleet.service';
import { AddForm } from '../../../models/form';

@Component({
  selector: 'app-add-form',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './add-form.html',
  styleUrl: './add-form.scss',
})
export class AddFormComponent implements AddForm {
  private dialog = inject(MatDialog);
  private fleetService = inject(FleetService);
  private snackBar = inject(MatSnackBar);
  closed = output<void>();
  isSubmitting = signal(false);
  locationTouched = false;

  stateOptions = stateOptions;

  form = this.defaultForm();

  get locationLabel(): string {
    const loc = this.form.get('location')?.value;
    return loc ? `${loc.latitude.toFixed(5)}, ${loc.longitude.toFixed(5)}` : '';
  }

  defaultForm() {
    return new FormGroup({
      plate: new FormControl('', { nonNullable: true, validators: Validators.required }),
      organization: new FormControl('', { nonNullable: true, validators: Validators.required }),
      type: new FormControl('', { nonNullable: true, validators: Validators.required }),
      usage: new FormControl('', { nonNullable: true, validators: Validators.required }),
      state: new FormControl<VehicleState>('stopped', {
        nonNullable: true,
        validators: Validators.required,
      }),
      location: new FormControl<GeoPoint | undefined>(undefined, {
        nonNullable: true,
        validators: Validators.required,
      }),
    });
  }

  addVehicle(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSubmitting.set(true);
    this.fleetService.addVehicle(this.form.getRawValue() as Omit<Vehicle, 'id'>).subscribe(() => {
      this.snackBar.open('خودرو با موفقیت اضافه شد', undefined, { duration: 2000 });
      this.cleanUp();
      this.close();
    });
  }

  cleanUp() {
    this.form = this.defaultForm();
  }

  close() {
    this.closed.emit();
  }

  openMapDialog(): void {
    this.locationTouched = true;
    const ref = this.dialog.open<GeoPickerDialogComponent, GeoPoint | null, GeoPoint | null>(
      GeoPickerDialogComponent,
      {
        width: '640px',
        direction: 'rtl',
      },
    );

    ref.afterClosed().subscribe((point?: GeoPoint | null) => {
      if (point) this.form.get('location')?.setValue(point);
    });
  }
}

export const stateOptions = [
  { value: 'moving', viewValue: 'در حال حرکت' },
  { value: 'stopped', viewValue: 'متوقف' },
  { value: 'disconnected', viewValue: 'قطع' },
];
