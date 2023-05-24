import { View, Text, Pressable, StyleSheet } from "react-native";
import { Activity } from "../../../@types/activity";
import { Ionicons } from "@expo/vector-icons";
import { globalColors } from "../../../global/styles/globalColors";
import ActivityMetadata from "./ActivityMetadata";
import ElevationChart from "./ElevationChart";

export default function SelectedActivity({
  activity,
  deselectActivity,
}: {
  activity: Activity | null;
  deselectActivity: () => void;
}) {
  return (
    <>
      <View>
        <Pressable
          android_ripple={{
            color: "rgba(0, 0, 0, .1)",
          }}
          style={({ pressed }) => [styles.iconContainer, pressed ? styles.pressed : null]}
          onPress={deselectActivity}
        >
          <Ionicons name="arrow-back-outline"
            size={24}
            color={globalColors.primaryGreen} />
        </Pressable>
      </View>
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={[
            styles.title,
            {
              borderBottomColor: activity?.metadata.color,
            }
          ]}>{activity?.description}</Text>
        </View>

      </View>
      <ActivityMetadata activity={activity!} />
      <ElevationChart activity={activity!} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  iconContainer: {
    marginLeft: 16
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    borderBottomWidth: 3.5,
  },
  pressed: {
    backgroundColor: "rgba(0, 0, 0, .05)",
  }
});

// style={({ pressed }) => [styles.icon, pressed ? styles.pressed : null]}
