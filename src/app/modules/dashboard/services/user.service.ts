import { inject, Service } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';
import { ApiService } from '../models/api';

@Service()
export class UserService implements ApiService {
  private httpClient = inject(HttpClient);
  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${environment.apiUrl}/users/`);
  }
  getUserById(id: string): Observable<User> {
    return this.httpClient.get<User>(`${environment.apiUrl}/users/${id}`);
  }
  addUser(user: Omit<User, 'id'>): Observable<User> {
    return this.httpClient.post<User>(`${environment.apiUrl}/users/`, user);
  }

  removeUser(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiUrl}/users/${id}`);
  }

  editUser(user: User): Observable<User> {
    return this.httpClient.put<User>(`${environment.apiUrl}/users/${user.id}`, user);
  }
}
