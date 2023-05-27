import { Position } from "@rnmapbox/maps/lib/typescript/types/Position";
import { LocationObjectCoords } from "expo-location";
/**
 *A function that converts the location return from user location updates into a format that can be used by the mapbox shapeSource
 * @param locations as returned by the locationManager
 * @returns [longitude, latitude] coordinates
 */
export function processCoordinates(locations: LocationObjectCoords[]) {
  let shapeCoords: Position[] = [];
  locations.forEach((location) => {
    shapeCoords.push([location.longitude, location.latitude]);
  });
  return shapeCoords;
}
