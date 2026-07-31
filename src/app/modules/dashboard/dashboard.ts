import { Component, OnInit, signal, inject, viewChild, effect } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  NavigationEnd,
  RouterLink,
  RouterOutlet,
  RouterLinkActive,
} from '@angular/router';
import { filter } from 'rxjs/operators';

import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { AuthService } from './services/auth';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { ProfileMenuComponent } from './components/profile-menu/profile-menu';
@Component({
  selector: 'app-dashboard',
  imports: [
    RouterOutlet,
    RouterLink,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    RouterLinkActive,
    MatIconModule,
    MatMenuModule,
    ProfileMenuComponent,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  toolbarTitle = signal('');

  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  sidenav = viewChild.required<MatSidenav>('sidenav');

  datetime = new Date().toLocaleString('fa-ir');
  isDarkMode = signal(localStorage.getItem('theme') === 'dark');

  authData = this.authService.getAuthData();
  isUserMenuOpened = false;

  platform = window.innerWidth < 680 ? 'mobile' : 'desktop';

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

  ngOnInit() {
    if (window.innerWidth < 1024) {
      this.sidenav().close();
    }

    this.updateTitleFromCurrentRoute();
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.updateTitleFromCurrentRoute();
    });
  }

  toggleDarkMode() {
    this.isDarkMode.update((v) => !v);
  }

  private updateTitleFromCurrentRoute() {
    let currentRoute = this.activatedRoute;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }
    const data = currentRoute.snapshot.data;
    this.toolbarTitle.set(data['toolbarTitle'] || 'منو');
  }
}
