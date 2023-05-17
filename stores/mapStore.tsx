import { create } from "zustand";
import { MapStyleTypes } from "../@types/mapStyleTypes";
import { CONFIG } from "../config/config";

export const mapStore = create<{
  mapStyle: {
    URL: string;
    TYPE: MapStyleTypes;
  };
  toggleMapStyle: (value: MapStyleTypes) => void;
}>((set) => ({
  mapStyle: {
    URL: CONFIG.MAP.TOPOGRAPHIC.URL,
    TYPE: MapStyleTypes.TOPOGRAPHIC,
  },
  toggleMapStyle: (value) =>
    set((state) => ({
      mapStyle: {
        URL:
          value === MapStyleTypes.SATELLITE
            ? CONFIG.MAP.SATELLITE.URL
            : CONFIG.MAP.TOPOGRAPHIC.URL,
        TYPE: value,
      },
    })),
}));
