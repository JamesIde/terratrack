export interface ExpoLocation {
  locations: Location[];
}

export interface Location {
  timestamp: number;
  coords: Coords;
}

export interface Coords {
  altitude: number;
  heading: number;
  altitudeAccuracy: number;
  latitude: number;
  speed: number;
  longitude: number;
  accuracy: number;
}
