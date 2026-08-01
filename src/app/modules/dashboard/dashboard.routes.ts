import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export interface DashboardRouteData {
  toolbarTitle: string;
}

export const dashboardRoutes: Routes = [
  {
    path: '',
    redirectTo: 'map',
    pathMatch: 'full',
  },
  {
    path: 'map',
    title: 'ردیابی',
    data: {
      toolbarTitle: 'ردیابی',
    } satisfies DashboardRouteData,
    loadComponent: () =>
      import('./components/tracking-panel/tracking-panel').then((m) => m.TrackingPanelComponent),
  },
  {
    path: 'fleet',
    title: 'پنل ناوگان',
    canActivate: [adminGuard],
    data: {
      toolbarTitle: 'ناوگان',
    } satisfies DashboardRouteData,
    loadComponent: () =>
      import('./components/fleet-management-panel/fleet-management-panel').then(
        (m) => m.FleetManagementPanelComponent,
      ),
  },
  {
    path: 'users',
    title: 'پنل کاربران',
    canActivate: [adminGuard],
    data: {
      toolbarTitle: 'کاربران',
    } satisfies DashboardRouteData,
    loadComponent: () =>
      import('./components/user-management-panel/user-management-panel').then(
        (m) => m.UserManagementPanelComponent,
      ),
  },
];
