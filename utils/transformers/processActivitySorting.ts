import { Activity } from "../../@types/activity";

export function processActivitySorting(
  data: Activity[],
  sort: string,
  search: string
) {
  // We could make this a lot more sophisticated, but for now, this will do.
  if (search && search.length > 0) {
    return data.filter((activity) => {
      return activity.description.toLowerCase().includes(search.toLowerCase());
    });
  }

  if (sort === "date") {
    return data.sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  } else if (sort === "distance") {
    return data.sort((a, b) => a.distance - b.distance);
  } else if (sort === "duration") {
    return data.sort((a, b) => a.duration - b.duration);
  } else if (sort === "elevationGain") {
    return data.sort(
      (a, b) => a.elevation.elevationGain - b.elevation.elevationGain
    );
  } else {
    return data;
  }
}
