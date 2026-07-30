export type Vehicle = {
  id: string;
  plate: string;
  organization: string;
  type: string;
  usage: string;
  state: VehicleState;
  location: GeoPoint;
};

export type VehicleState = 'stopped' | 'moving' | 'disconnected';

export interface GeoPoint {
  latitude: number;
  longitude: number;
}
