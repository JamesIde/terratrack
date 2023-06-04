import { View, Text, Pressable, StyleSheet } from "react-native";
import { Activity } from "../../../@types/activity";
import { Button } from "react-native-paper";
import { globalColors } from "../../../global/styles/globalColors";
import ActivityMetadata from "./ActivityMetadata";
import ElevationChart from "./ElevationChart";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default function SelectedActivity({
  activity,
  deselectActivity,
}: {
  activity: Activity | null;
  deselectActivity: () => void;
}) {
  // onPress={deselectActivity}
  return (
    <>
      <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
        <Button
          mode="text"
          onPress={deselectActivity}
          icon="arrow-left"
          textColor={globalColors.primaryGreen}
        >
          Back
        </Button>
        <Button
          mode="text"
          onPress={() => console.log(`here`)}
          icon="upload"
          textColor={globalColors.primaryGreen}
        >
          Upload
        </Button>
      </View>
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <Text
            style={[
              styles.title,
              {
                borderBottomColor: activity?.metadata.color,
              },
            ]}
          >
            {activity?.description}
          </Text>
        </View>
      </View>
      <ActivityMetadata activity={activity!} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  iconContainer: {
    marginLeft: 16,
  },
  pressed: {
    backgroundColor: "rgba(0, 0, 0, .05)",
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    borderBottomWidth: 3.5,
  },
});

// style={({ pressed }) => [styles.icon, pressed ? styles.pressed : null]}
