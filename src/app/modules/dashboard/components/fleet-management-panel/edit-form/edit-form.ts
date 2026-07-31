import { Component, inject, input, InputSignal, OnInit, output } from '@angular/core';
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
import { HttpClientService } from '../../../services/http-client';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeoPickerDialogComponent } from '../geo-picker-dialog/geo-picker-dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

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
export class EditFormComponent implements OnInit {
  private httpClientService: HttpClientService = inject(HttpClientService);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  onClose = output<void>();
  onSubmited = output<void>();

  id: InputSignal<string> = input.required<string>();
  form = this.defaultForm();
  locationTouched = false;
  private dialog: MatDialog = inject(MatDialog);

  stateOptions = [
    { value: 'moving', viewValue: 'در حال حرکت' },
    { value: 'stopped', viewValue: 'متوقف' },
    { value: 'disconnected', viewValue: 'قطع' },
  ];
  ngOnInit() {
    this.getInitialData();
  }

  getInitialData() {
    this.httpClientService.getVehicleById(this.id()).subscribe((data) => {
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
    this.httpClientService
      .editVehicle({
        ...this.form.getRawValue(),
        location: this.form.getRawValue().location as GeoPoint,
      })
      .subscribe(() => {
        this.snackBar.open('خودرو با موفقیت ویرایش شد.', undefined, { duration: 2000 });
      });
    this.cleanUp();
    this.close();
  }
  close() {
    this.onClose.emit();
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
