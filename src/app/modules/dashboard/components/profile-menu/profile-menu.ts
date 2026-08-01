import { Component, inject, viewChild, OnInit } from '@angular/core';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthObject, AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile-menu',
  standalone: true,
  imports: [MatMenuModule, MatButtonModule, MatIconModule, MatDividerModule, MatTooltipModule],
  templateUrl: './profile-menu.html',
  styleUrls: ['./profile-menu.scss'],
})
export class ProfileMenuComponent implements OnInit {
  isUserMenuOpened = false;
  userMenu = viewChild.required(MatMenu);
  private authService = inject(AuthService);
  authData: AuthObject | null = this.authService.getAuthData();

  // constructor(private authService: AuthService) {
  //   this.authData = this.authService.getAuthData();
  // }

  ngOnInit() {
    if (this.authData === null) {
      this.authService.logout();
    }
    this.userMenu().closed.subscribe(() => {
      this.isUserMenuOpened = false;
    });
  }

  onLogout() {
    this.authService.logout();
  }
}
