import { View, Text, StyleSheet } from "react-native";
import { recordingStore } from "../../../stores/recordingStore";
import { RecordingState } from "../../../@types/recordingState";
import { LocationObjectCoords } from "expo-location";
import { processStatOverlayHeader } from "../../../utils/transformers/processStatOverlayHeader";
import { formatShortFormTime } from "../../../utils/transformers/processTime";
import { processShortDistance } from "../../../utils/transformers/processDistance";
export default function StatOverlay({
  distance,
  timeInSeconds,
  recordingState,
  locations,
}: {
  distance: number;
  timeInSeconds: number;
  recordingState: RecordingState;
  locations: LocationObjectCoords[];
}) {
  console.log(processShortDistance(distance));
  const elevation = recordingStore((state) => state.currentElevation);
  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.text}>
          {processStatOverlayHeader(locations, recordingState)}
        </Text>
        <Text style={styles.text}>Dist - {processShortDistance(distance)}</Text>
        <Text style={styles.text}>
          Time - {formatShortFormTime(timeInSeconds)}
        </Text>
        <Text style={styles.text}>Curr. Ele - {elevation.toFixed(0)}m</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    backgroundColor: "rgba(52, 52, 52, 0.5)",
    width: "100%",
    height: "3%",
  },
  container: {
    position: "absolute",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
});
