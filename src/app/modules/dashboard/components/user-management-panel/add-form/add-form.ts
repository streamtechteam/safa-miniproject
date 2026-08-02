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
import { UserRole } from '../../../models/user';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../services/user.service';
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
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);
  closed = output<void>();
  isSubmitting = signal(false);
  roleOptions = roleOptions;

  form = this.defaultForm();

  defaultForm() {
    return new FormGroup({
      name: new FormControl('', { nonNullable: true, validators: Validators.required }),
      email: new FormControl('', { nonNullable: true, validators: Validators.required }),
      role: new FormControl<UserRole>('technician ', {
        nonNullable: true,
        validators: Validators.required,
      }),
      username: new FormControl('', { nonNullable: true, validators: Validators.required }),
      password: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
    });
  }

  addUser(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSubmitting.set(true);
    this.userService.addUser(this.form.getRawValue()).subscribe(() => {
      this.snackBar.open('کاربر با موفقیت اضافه شد.', undefined, { duration: 2000 });
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
}

export const roleOptions = [
  { value: 'technician ', viewValue: 'کارشناس' },
  { value: 'sys-admin', viewValue: 'مدیر سامانه' },
];
