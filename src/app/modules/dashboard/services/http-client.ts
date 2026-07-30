import { inject, Service } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { Vehicle } from '../models/fleet';

const URL = 'http://localhost:3000';
@Service()
export class HttpClientService {
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

  getFleet(): Observable<Vehicle[]> {
    return this.httpClient.get<Vehicle[]>(URL + '/fleet');
  }
  getVehicleById(id: string): Observable<Vehicle> {
    return this.httpClient.get<Vehicle>(URL + '/fleet/' + id);
  }
  addVehicle(vehicle: Omit<Vehicle, 'id'>): Observable<Vehicle> {
    return this.httpClient.post<Vehicle>(URL + '/fleet', vehicle);
  }

  removeVehicle(id: string): Observable<void> {
    return this.httpClient.delete<void>(URL + '/fleet/' + id);
  }

  editVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.httpClient.put<Vehicle>(URL + '/fleet/' + vehicle.id, vehicle);
  }
}
