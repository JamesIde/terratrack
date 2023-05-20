import { Position } from "@rnmapbox/maps/lib/typescript/types/Position";
import { Coordinate } from "../../@types/coordinates";
/**
 *A function that converts the location return from user location updates into a format that can be used by the mapbox shapeSource
 * @param locations as returned by the locationManager
 * @returns [longitude, latitude] coordinates
 */
export function processCoordinates(locations: Coordinate[]) {
  let shapeCoords: Position[] = [];
  locations.forEach((location) => {
    shapeCoords.push([location.longitude, location.latitude]);
  });
  return shapeCoords;
}
