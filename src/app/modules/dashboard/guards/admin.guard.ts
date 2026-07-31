import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  if (authService.checkLoggedIn() && authService.isAdmin()) {
    return true;
  }
  snackBar.open('شما به این بخش دسترسی ندارید.', undefined, { duration: 2000 });
  router.navigate(['/dashboard']);
  return false;
};
