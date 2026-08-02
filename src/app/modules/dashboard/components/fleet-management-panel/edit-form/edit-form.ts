import { Component, inject, input, InputSignal, OnInit, output, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GeoPoint, VehicleState } from '../../../models/fleet';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeoPickerDialogComponent } from '../geo-picker-dialog/geo-picker-dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FleetService } from '../../../services/fleet.service';
import { stateOptions } from '../add-form/add-form';
import { EditForm } from '../../../models/form';

@Component({
  selector: 'app-edit-form',
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
  templateUrl: './edit-form.html',
  styleUrl: './edit-form.scss',
})
export class EditFormComponent implements OnInit, EditForm {
  private fleetService = inject(FleetService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  closed = output<void>();
  isSubmitting = signal(false);
  id: InputSignal<string> = input.required<string>();
  form = this.defaultForm();
  locationTouched = false;

  stateOptions = stateOptions;
  ngOnInit() {
    this.getInitialData();
  }

  getInitialData() {
    this.fleetService.getVehicleById(this.id()).subscribe((data) => {
      this.form.patchValue(data);
    });
  }

  defaultForm() {
    return new FormGroup({
      id: new FormControl(),
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

  editVehicle(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSubmitting.set(true);
    this.fleetService
      .editVehicle({
        ...this.form.getRawValue(),
        location: this.form.getRawValue().location as GeoPoint,
      })
      .subscribe(() => {
        this.snackBar.open('خودرو با موفقیت ویرایش شد.', undefined, { duration: 2000 });
        this.cleanUp();
        this.close();
      });
  }
  close() {
    this.closed.emit();
  }
  cleanUp() {
    this.form = this.defaultForm();
  }

  get locationLabel(): string {
    const loc = this.form.get('location')?.value;
    return loc ? `${loc.latitude.toFixed(5)}, ${loc.longitude.toFixed(5)}` : '';
  }

  openMapDialog(): void {
    this.locationTouched = true;
    const ref = this.dialog.open<GeoPickerDialogComponent, GeoPoint | null, GeoPoint | null>(
      GeoPickerDialogComponent,
      {
        data: this.form.get('location')?.getRawValue(),
        width: '640px',
        direction: 'rtl',
      },
    );

    ref.afterClosed().subscribe((point?: GeoPoint | null) => {
      if (point) this.form.get('location')?.setValue(point);
    });
  }
}
