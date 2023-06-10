import { create } from "zustand";
import { Activity } from "../@types/activity";
import { ElevationMetadata } from "../@types/activity";

export const activityStore = create<{
  selectedActivity: Activity | null;
  setSelectedActivity: (activity: Activity | null) => void;
  chartData: Activity | null;
  setChartData: (chartData: Activity | null) => void;
  navigatedFromAccount: boolean;
  setNavigatedFromAccount: (navigatedFromAccount: boolean) => void;
}>((set) => ({
  selectedActivity: null,
  setSelectedActivity: (activity: Activity | null) =>
    set({ selectedActivity: activity }),
  chartData: null,
  setChartData: (chartData: Activity | null) => set({ chartData }),
  closeElevationModal: () => set({ chartData: null }),
  navigatedFromAccount: false,
  setNavigatedFromAccount: (navigatedFromAccount: boolean) =>
    set({ navigatedFromAccount }),
}));
