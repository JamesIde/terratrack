import { create } from "zustand";

// TODO Type all of this when we know what to expect!!!
export const recordingStore = create<{
  locations: any[];
  showLine: boolean;
  updateLocation: (location: any) => void;
  toggleLine: () => void;
}>((set) => ({
  locations: [],
  showLine: false,
  updateLocation: (location: any) => {
    set((state) => ({
      locations: [...state.locations, location],
    }));
  },
  toggleLine: () => {
    set((state) => ({
      showLine: !state.showLine,
    }));
  },
}));
