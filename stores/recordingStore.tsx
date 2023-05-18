import { create } from "zustand";
import { RecordingStateEnum } from "../@types/enum/recordingStateEnum";
import { Coordinate } from "../@types/coordinates";

export const recordingStore = create<{
  locations: Array<Coordinate>;
  showLine: boolean;
  recordingState: {
    isRecording: boolean;
    isPaused: boolean;
    isStopped: boolean;
  };
  handleRecording: (action: RecordingStateEnum) => void;
  updateLocation: (location: Coordinate) => void;
  toggleLine: () => void;
}>((set) => ({
  locations: [],
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
  toggleLine: () => {
    set((state) => ({
      showLine: !state.showLine,
    }));
  },
}));
