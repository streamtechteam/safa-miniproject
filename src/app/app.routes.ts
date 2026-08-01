import { Routes } from '@angular/router';
import { dashboardGuard } from './modules/dashboard/guards/dashboard.guard';
import { loginGuard } from './modules/login/guards/login.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./modules/dashboard/dashboard').then((m) => m.DashboardComponent),
    canActivate: [dashboardGuard],
    canActivateChild: [dashboardGuard],
    loadChildren: () =>
      import('./modules/dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
  },
  {
    path: 'login',
    loadComponent: () => import('./modules/login/login').then((m) => m.LoginComponent),
    canActivate: [loginGuard],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./modules/notfound/notfound.component').then((m) => m.NotFoundComponent),
  },
];
