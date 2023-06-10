import { Activity } from "../@types/activity";
import { ShowAlert } from "../utils/alert/alert";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 *
 * activity Will be reworked when supabase integration is complete
 */

export async function addActivity(activity: Activity, id: string) {
  try {
    await AsyncStorage.setItem(id, JSON.stringify(activity));
  } catch (error) {
    ShowAlert("Error", "There was an error adding the activity", [
      {
        text: "OK",
      },
    ]);
  }
}

export async function getKeys() {
  return await AsyncStorage.getAllKeys();
}

export async function getActivities() {
  let keys = await AsyncStorage.getAllKeys();
  let activities: Activity[] = [];
  for (let key of keys) {
    let activity = await AsyncStorage.getItem(key);
    if (activity) {
      activities.push(JSON.parse(activity));
    }
  }
  return activities;
}

export async function getActivity(key: string) {
  let activity = await AsyncStorage.getItem(key);
  if (activity) {
    return JSON.parse(activity);
  }
  return null;
}

export async function deleteActivity(key: string) {
  return await AsyncStorage.removeItem(key);
}

export async function clearActivities() {
  return await AsyncStorage.clear();
}
