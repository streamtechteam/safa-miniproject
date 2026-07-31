import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle } from '../models/fleet';

const URL = 'http://localhost:3000';
@Service()
export class FleetService {
  private httpClient: HttpClient = inject(HttpClient);

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
