import { Component, OnInit, signal, inject, viewChild, effect, DestroyRef } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  NavigationEnd,
  RouterLink,
  RouterOutlet,
  RouterLinkActive,
} from '@angular/router';
import { filter, startWith, switchMap } from 'rxjs/operators';

import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { AuthService } from './services/auth.service';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { ProfileMenuComponent } from './components/profile-menu/profile-menu';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    MatMenuModule,
    ProfileMenuComponent,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  toolbarTitle = signal('');

  private authService = inject(AuthService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  sidenav = viewChild.required<MatSidenav>('sidenav');

  datetime = signal(new Date().toLocaleString('fa-ir'));
  isDarkMode = signal(localStorage.getItem('theme') === 'dark');

  authData = this.authService.getAuthData();
  isUserMenuOpened = false;

  platform = window.innerWidth < 680 ? 'mobile' : 'desktop';

  constructor() {
    interval(1000)
      .pipe(startWith(0), takeUntilDestroyed())
      .subscribe(() => {
        this.datetime.set(new Date().toLocaleString('fa-ir'));
      });

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
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
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
