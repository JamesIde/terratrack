import { View, Text, StyleSheet } from "react-native";
import { globalColors } from "../../../global/styles/globalColors";
import { Activity } from "../../../@types/activity";
import { processDistance } from "../../../utils/transformers/processDistance";
import { formatElevation } from "../../../utils/transformers/processElevation";
import { formatShortFormTime } from "../../../utils/transformers/processTime";
export default function ActivityMetadata({ activity }: { activity: Activity }) {
  // This could easily be dynamic. Why not try it?
  return (
    <View style={styles.container}>
      <View style={styles.gridItem}>
        <Text style={styles.label}>CATEGORY</Text>
        <Text style={styles.text}>{activity.type}</Text>
      </View>
      <View style={styles.gridItem}>
        <Text style={styles.label}>DISTANCE</Text>
        <Text style={styles.text}>{processDistance(activity.distance)}</Text>
      </View>
      <View style={styles.gridItem}>
        <Text style={styles.label}>DURATION</Text>
        <Text style={styles.text}>
          {" "}
          {formatShortFormTime(activity.duration)}
        </Text>
      </View>
      <View style={styles.gridItem}>
        <Text style={styles.label}>ELEVATION</Text>
        <Text style={styles.text}>
          {formatElevation(activity.elevation.elevationGain)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  gridItem: {
    width: "48%",
    height: 75,
    backgroundColor: globalColors.primaryWhite,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: globalColors.primaryDarkBlue,
  },
  text: {
    fontSize: 16,
  },
});
