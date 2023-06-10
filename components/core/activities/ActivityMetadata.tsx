import { View, Text, StyleSheet, Pressable } from "react-native";
import { globalColors } from "../../../global/styles/globalColors";
import { Activity } from "../../../@types/activity";
import { processDistance } from "../../../utils/transformers/processDistance";
import { formatElevation } from "../../../utils/transformers/processElevation";
import { formatShortFormTime } from "../../../utils/transformers/processTime";
import { activityStore } from "../../../stores/activityStore";
import { AntDesign } from "@expo/vector-icons";
export default function ActivityMetadata({ activity }: { activity: Activity }) {
  const setChartData = activityStore((state) => state.setChartData);
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
      <Pressable
        style={styles.gridItem}
        android_ripple={{
          color: "rgba(0, 0, 0, .1)",
        }}
        onPress={() => setChartData(activity)}
      >
        <View>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <AntDesign
              name="areachart"
              size={20}
              color={globalColors.primaryDarkBlue}
              style={{
                paddingRight: 5,
              }}
            />
            <Text style={styles.label}>ELEVATION</Text>
          </View>
          <Text
            style={[
              styles.text,
              {
                textAlign: "center",
              },
            ]}
          >
            {formatElevation(activity.elevation.elevationGain)}
          </Text>
        </View>
      </Pressable>
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
  gridItemPressed: {
    opacity: 0.5,
  },
});
