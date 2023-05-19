// Converts seconds to hh:mm:ss
export function toTime(seconds: number) {
  var date = new Date(0);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 8);
}
