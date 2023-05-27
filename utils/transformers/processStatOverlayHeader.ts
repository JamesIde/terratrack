import { LocationObjectCoords } from "expo-location";
import { RecordingState } from "../../@types/recordingState";

/**
 * Returns a label depending on number of locations in coordinates array and recording mode
 */
export function processStatOverlayHeader(
  locations: LocationObjectCoords[],
  recordingState: RecordingState
) {
  let state = "";
  if (locations.length === 0) {
    return state + "Inactive";
  } else if (locations.length === 0 && recordingState.isRecording) {
    return state + "No Signal";
  } else if (recordingState.isStopped) {
    return state + "Paused";
  } else if (locations.length < 2) {
    return state + "GPS Ready";
  } else if (recordingState.isRecording) {
    return state + "Recording ";
  } else if (recordingState.isStopped) {
    return state + "Stopped";
  }
}
