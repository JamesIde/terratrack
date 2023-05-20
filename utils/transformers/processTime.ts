/**
 * Converts seconds to hh:mm:ss
 */
export function processTime(seconds: number) {
  const date = new Date(0);
  date.setSeconds(seconds);
  const timeString = date.toISOString().substr(11, 8);
  return formatTime(timeString);
}

export function formatTime(time: string) {
  const [hours, minutes, seconds] = time.split(":").map(Number);

  if (hours > 0) {
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  } else {
    return `${seconds} second${seconds !== 1 ? "s" : ""}`;
  }
}
