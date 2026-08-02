import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle } from '../models/fleet';
import { environment } from '../../../environment';
import { ApiService } from '../models/api';

@Service()
export class FleetService implements ApiService {
  private httpClient = inject(HttpClient);

  getFleet(): Observable<Vehicle[]> {
    return this.httpClient.get<Vehicle[]>(`${environment.apiUrl}/fleet/`);
  }
  getVehicleById(id: string): Observable<Vehicle> {
    return this.httpClient.get<Vehicle>(`${environment.apiUrl}/fleet/${id}`);
  }
  addVehicle(vehicle: Omit<Vehicle, 'id'>): Observable<Vehicle> {
    return this.httpClient.post<Vehicle>(`${environment.apiUrl}/fleet/`, vehicle);
  }

  removeVehicle(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiUrl}/fleet/${id}`);
  }

  editVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.httpClient.put<Vehicle>(`${environment.apiUrl}/fleet/${vehicle.id}`, vehicle);
  }
}
