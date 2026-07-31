import { inject, Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userService: UserService = inject(UserService);
  private router: Router = inject(Router);

  private userRole: string = 'guest';

  constructor() {
    this.checkLoggedIn();
  }

  checkLoggedIn(): boolean {
    if (localStorage.getItem('auth')) {
      const storage = JSON.parse(localStorage.getItem('auth') as string) as AuthObject;
      if (
        !storage.id ||
        !storage.username ||
        !storage.password ||
        !storage.role ||
        !storage.name ||
        !storage.email
      ) {
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
      map((users) => {
        const user = users.filter((value) => {
          return value.password === password && value.username === username;
        });
        if (user.length > 0) {
          return user[0];
        }
        if (user.length === 0) {
          return null;
        }
        return null;
      }),
      map((user) => {
        if (user !== null || user !== undefined) {
          const auth_object = {
            id: user?.id,
            name: user?.name,
            email: user?.email,
            username: user?.username,
            password: user?.password,
            role: user?.role,
          };

          localStorage.setItem('auth', JSON.stringify(auth_object));
          return 200;
        }
        return 400;
      }),
    );
  }

  getAuthData(): AuthObject {
    const storage = JSON.parse(localStorage.getItem('auth') as string) as AuthObject;
    return storage;
  }

  logout() {
    localStorage.removeItem('auth');
    this.router.navigate(['/login']);
  }
}

export type AuthObject = {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  role: string;
};
