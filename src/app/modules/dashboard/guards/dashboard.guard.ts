import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const dashboardGuard: CanActivateFn = (_, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.checkLoggedIn()
    ? true
    : router.createUrlTree(['/login'], {
        queryParams: {
          redirect: state.url,
        },
      });
};
