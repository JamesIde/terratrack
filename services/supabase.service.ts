import {
  Activity,
  ActivityMetadata,
  ElevationMetadata,
} from "../@types/activity";
import { supabase } from "../lib/supabase";
import { ShowAlert } from "../utils/alert/alert";

/**
 * A service for interacting with supabase. It returns the underlying supabase response wrapped in a promise
 */

/**
 * Upload activity to supabase
 */
export function upload(activity: Activity, userId: string) {
  return supabase.from("activities").insert({
    id: activity.id,
    userId: userId,
    coordinates: JSON.stringify(activity.coordinates),
    metadata: JSON.stringify(activity.metadata),
    elevation: JSON.stringify(activity.elevation),
    description: activity.description,
    distance: activity.distance,
    duration: activity.duration,
    startTime: JSON.stringify(activity.startTime),
    endTime: JSON.stringify(activity.endTime),
    type: activity.type,
    slug: activity.slug,
  });
}

/**
 * Check if activity exists in supabase
 */
export async function exists(userId: string, activityId: string) {
  let activity = await supabase
    .from("activities")
    .select("*")
    .eq("userId", userId)
    .eq("id", activityId)
    .limit(1);
  if (activity.data!.length === 1) {
    return true;
  }

  return false;
}

/**
 * Retrieve activity from supabase based on user Id
 * Parses various properties into their types
 * @param userId
 * @returns activity array
 */
export async function retrieveAndParse(userId: string) {
  let activities: Activity[] = [];
  let totalDistance = 0;
  let activityTypeCount: { [key: string]: number } = {};

  try {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("userId", userId)
      .throwOnError();

    if (error) {
      ShowAlert("Error", "There was an error retrieving your activities", [
        {
          text: "OK",
        },
      ]);
    }
    // Why so many ! >:(
    if (data!.length > 0) {
      data!.forEach((activity) => {
        activities.push({
          id: activity.id,
          userId: activity.userId!,
          coordinates: JSON.parse(activity.coordinates as string) as number[][],
          metadata: JSON.parse(activity.metadata as string) as ActivityMetadata,
          elevation: JSON.parse(
            activity.elevation as string
          ) as ElevationMetadata,
          description: activity.description!,
          distance: activity.distance!,
          duration: activity.duration!,
          startTime: new Date(activity.startTime!),
          endTime: new Date(activity.endTime!),
          type: activity.type!,
          slug: activity.slug!,
        });
        totalDistance += activity.distance!;
      });
    }
  } catch (error) {
    console.error("Error retrieving activities:", error);
    ShowAlert("Error", "There was an error retrieving your activities", [
      {
        text: "OK",
      },
    ]);
  }

  return { activities, totalDistance, activityTypeCount };
}

export async function deleteActivity(id: string) {
  return supabase.from("activities").delete().eq("id", id);
}
