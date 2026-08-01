import { inject, Service } from '@angular/core';
import { map, tap } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from './user.service';

export type UserRole = 'guest' | 'sys-admin' | 'operator';

@Service()
export class AuthService {
  private userService = inject(UserService);
  private router = inject(Router);

  private userRole: UserRole = 'guest';

  constructor() {
    this.checkLoggedIn();
  }

  checkLoggedIn(): boolean {
    if (localStorage.getItem('auth')) {
      const storage = JSON.parse(localStorage.getItem('auth') as string) as AuthObject;
      if (!storage.id || !storage.username || !storage.role || !storage.name || !storage.email) {
        return false;
      }
      this.userRole = storage.role;
      return true;
    }
    return false;
  }

  isAdmin(): boolean {
    return this.userRole === 'sys-admin';
  }

  login(username: string, password: string) {
    return this.userService.getUsers().pipe(
      map((users) =>
        users.find((user) => user.username === username && user.password === password),
      ),
      tap((user) => {
        if (user) {
          localStorage.setItem('auth', JSON.stringify(user));
        }
      }),
      map((user) => !!user),
    );
  }

  getAuthData(): AuthObject | null {
    const raw = localStorage.getItem('auth');

    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as AuthObject;
  }

  logout() {
    localStorage.removeItem('auth');
    this.router.navigate(['/login']);
  }
}

export interface AuthObject {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
}
