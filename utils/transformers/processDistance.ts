/**
 * Convert distance in meters to a string with the correct unit
 */
export function processDistance(distance: number) {
  if (distance < 1) {
    return `${distance.toFixed(2)} meters`;
  }

  if (distance < 1000) {
    return `${distance.toFixed()} meters`;
  }

  return `${(distance / 1000).toFixed(2)} km`;
}
