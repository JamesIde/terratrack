import { create } from "zustand";
import { RecordingStateEnum } from "../@types/enum/recordingStateEnum";
import { Coordinate } from "../@types/coordinates";
import { haversineDistance } from "../utils/algo/haversineDistance";
import { HCoord } from "../@types/haversineCoords";
import { activityTypeEnum } from "../@types/enum/activityTypeEnum";
export const recordingStore = create<{
  locations: Array<Coordinate>;
  distance: number;
  currentActivity: string;
  showLine: boolean;
  recordingState: {
    isRecording: boolean;
    isPaused: boolean;
    isStopped: boolean;
  };
  handleRecording: (action: RecordingStateEnum) => void;
  updateLocation: (location: Coordinate) => void;
  updateDistance: (coord1: HCoord, coord2: HCoord) => void;
  setShowLine: (show: boolean) => void;
  clearCurrentActivity: () => void;
}>((set) => ({
  locations: [],
  distance: 0,
  currentActivity: activityTypeEnum.WALKING,
  showLine: false,
  recordingState: {
    isRecording: false,
    isPaused: false,
    isStopped: false,
  },
  handleRecording(action: RecordingStateEnum) {
    switch (action) {
      case RecordingStateEnum.RECORDING:
        set((state) => ({
          recordingState: {
            ...state.recordingState,
            isRecording: true,
            isStopped: false,
          },
        }));
        break;
      case RecordingStateEnum.PAUSED:
        set((state) => ({
          recordingState: {
            ...state.recordingState,
            isPaused: true,
            isRecording: false,
          },
        }));
        break;
      case RecordingStateEnum.STOPPED:
        set((state) => ({
          recordingState: {
            ...state.recordingState,
            isStopped: true,
            isRecording: false,
            isPaused: false,
          },
        }));
        break;
      default:
        break;
    }
  },
  updateLocation: (location: any) => {
    set((state) => ({
      locations: [...state.locations, location],
    }));
  },
  setShowLine: (show: boolean) => {
    set((state) => ({
      showLine: show,
    }));
  },
  updateDistance: (coord1: HCoord, coord2: HCoord) => {
    set((state) => ({
      ...state,
      distance: state.distance + haversineDistance(coord1, coord2),
    }));
  },
  clearCurrentActivity: () => {
    set((state) => ({
      ...state,
      distance: 0,
      locations: [],
    }));
  },
}));
