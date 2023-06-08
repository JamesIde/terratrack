// Converts a date to a string in the format of "Wednesday, 1 January 2020, 12:00:00 am"
export function processNewDate(date: Date) {
  return new Intl.DateTimeFormat("en-AU", {
    year: "numeric",
    month: "long",
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    second: "numeric",
  }).format(date);
}

// Converts something like "Saturday, 20 May 2023, 8:40:07 am" into 20/05/2023 - 8:40am
export function processShortDate(date: string) {
  let newDate = new Date(date);
  let formattedDate = newDate.toLocaleDateString("en-AU");
  let formattedTime = newDate.toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${formattedDate} - ${formattedTime}`;
}

/**
 * A function that converts the date string from YYYY-MM-DD to DD Month YYYY
 * @param date
 * @returns formatted date string as DD Month YYYY
 */
export function processLongDate(date: Date) {
  return date.toLocaleString("en-AU", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
