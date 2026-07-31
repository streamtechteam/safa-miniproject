import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../dashboard/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private authService: AuthService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loginForm = new FormGroup({
    username: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>('', [Validators.required]),
    captcha: new FormControl<string>('', [Validators.required]),
  });
  hidePassword = true;
  isDarkMode = signal(localStorage.getItem('theme') === 'dark');

  constructor() {
    effect(() => {
      const isDark = this.isDarkMode();
      if (isDark) {
        document.documentElement.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  toggleDarkMode() {
    this.isDarkMode.update((v) => !v);
  }

  togglePassword(): void {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.authService
      .login(
        this.loginForm.getRawValue().username as string,
        this.loginForm.getRawValue().password as string,
      )
      .subscribe((data) => {
        if (data === 200) {
          this.snackBar.open('ورود موفقیت آمیز بود.', undefined, { duration: 3000 });
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        } else if (data === 400) {
          this.snackBar.open('ورود شکست خورد.', undefined, { duration: 3000 });
        }
      });
  }
}
