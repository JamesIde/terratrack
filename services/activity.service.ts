import AsyncStorage from "@react-native-async-storage/async-storage";
import { Activity } from "../@types/activity";
import uuid from "react-native-uuid";

export async function addActivity(activity: Activity) {
  return await AsyncStorage.setItem(
    uuid.v4().toString(),
    JSON.stringify(activity)
  );
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
