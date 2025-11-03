export interface DzialkaResponse {
  id: string;
  voivodeship: string;
  county: string;
  commune: string;
  region: string;
  parcel: string;
  geometry: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}
