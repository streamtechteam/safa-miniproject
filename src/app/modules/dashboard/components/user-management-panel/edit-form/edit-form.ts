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
import { User, UserRole } from '../../../models/user';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { roleOptions } from '../add-form/add-form';
import { UserService } from '../../../services/user.service';

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
  private userService: UserService = inject(UserService);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  onClose = output<void>();
  onSubmited = output<void>();

  id: InputSignal<string> = input.required<string>();
  form = this.defaultForm();
  private dialog: MatDialog = inject(MatDialog);

  roleOptions = roleOptions;

  ngOnInit() {
    this.userService.getUserById(this.id()).subscribe((data) => {
      this.form.patchValue(data);
    });
  }

  defaultForm() {
    return new FormGroup({
      id: new FormControl(),
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

  editUser(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.userService.editUser(this.form.getRawValue()).subscribe((data) => {
      this.snackBar.open('کاربر با موفقیت ویرایش شد.', undefined, { duration: 2000 });
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
}
