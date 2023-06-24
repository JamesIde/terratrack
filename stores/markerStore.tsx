import { create } from "zustand";
import { Position } from "@rnmapbox/maps/lib/typescript/types/Position";

export const markerStore = create<{
  marker: Position | null;
  setMarker: (marker: Position | null) => void;
}>((set) => ({
  marker: null,
  setMarker: (marker: Position | null) => {
    set(() => ({
      marker,
    }));
  },
}));
