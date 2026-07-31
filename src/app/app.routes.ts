import { Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login';
import { DashboardComponent } from './modules/dashboard/dashboard';
import { FleetManagementPanelComponent } from './modules/dashboard/components/fleet-management-panel/fleet-management-panel';
import { UserManagementPanelComponent } from './modules/dashboard/components/user-management-panel/user-management-panel';
import { dashboardGuard } from './modules/dashboard/guards/dashboard.guard';
import { loginGuard } from './modules/login/guards/login.guard';
import { adminGuard } from './modules/dashboard/guards/admin.guard';
import { TrackingPanelComponent } from './modules/dashboard/components/tracking-panel/tracking-panel';
import { dashboardRoutes } from './modules/dashboard/dashboard.routes';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
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
