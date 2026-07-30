import { Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login';
import { DashboardComponent } from './modules/dashboard/dashboard';
import { FleetManagementPanelComponent } from './modules/dashboard/components/fleet-management-panel/fleet-management-panel';
import { UserManagementPanelComponent } from './modules/dashboard/components/user-management-panel/user-management-panel';
import { dashboardGuard } from './modules/dashboard/guards/dashboard.guard';
import { loginGuard } from './modules/login/guards/login.guard';
import { adminGuard } from './modules/dashboard/guards/admin.guard';
import { TrackingPanelComponent } from './modules/dashboard/components/tracking-panel/tracking-panel';

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
    children: [
      {
        path: '',
        redirectTo: 'map',
        pathMatch: 'full',
      },
      {
        path: 'map',
        title: 'سامانه کنترل ناوگان شیراز',
        data: {
          toolbarTitle: 'ردیابی',
        },
        component: TrackingPanelComponent,
      },
      {
        path: 'fleet',
        title: 'سامانه کنترل ناوگان شیراز',
        canActivate: [adminGuard],
        data: {
          toolbarTitle: 'ناوگان',
        },
        component: FleetManagementPanelComponent,
      },
      {
        path: 'users',
        title: 'سامانه کنترل ناوگان شیراز',
        canActivate: [adminGuard],
        data: {
          toolbarTitle: 'کاربران',
        },
        component: UserManagementPanelComponent,
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard],
  },
];
