import { create } from "zustand";
import { Activity } from "../@types/activity";

export const activityStore = create<{
  selectedActivity: Activity | null;
  setSelectedActivity: (activity: Activity | null) => void;
}>((set) => ({
  selectedActivity: null,
  setSelectedActivity: (activity: Activity | null) =>
    set({ selectedActivity: activity }),
}));
