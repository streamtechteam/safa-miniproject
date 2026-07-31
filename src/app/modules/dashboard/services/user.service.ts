import { inject, Service } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { Vehicle } from '../models/fleet';

const URL = 'http://localhost:3000';
@Service()
export class UserService {
  private httpClient: HttpClient = inject(HttpClient);
  getUsers(): Observable<User[]> {
    return this.httpClient
      .get(URL + '/users', { mode: 'cors' })
      .pipe(map((data) => data as User[]));
  }
  getUserById(id: string): Observable<User> {
    return this.httpClient.get<User>(URL + '/users/' + id);
  }
  addUser(user: Omit<User, 'id'>): Observable<User> {
    return this.httpClient.post<User>(URL + '/users', user);
  }

  removeUser(id: string): Observable<void> {
    return this.httpClient.delete<void>(URL + '/users/' + id);
  }

  editUser(user: User): Observable<User> {
    return this.httpClient.put<User>(URL + '/users/' + user.id, user);
  }
}
