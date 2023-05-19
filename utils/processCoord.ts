import { Coordinate } from "../@types/coordinates";
import { HCoord } from "../@types/haversineCoords";

/**
 * Transform the Mapbox location object into a h-coord for distance calculations
 */
export function transformCoord(coord1: Coordinate, coord2: Coordinate) {
  let a: HCoord = {
    lat: coord1.latitude,
    lng: coord1.longitude,
  };
  let b: HCoord = {
    lat: coord2.latitude,
    lng: coord2.longitude,
  };
  return { a, b };
}