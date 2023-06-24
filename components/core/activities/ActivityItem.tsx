import { View, Text, StyleSheet, Pressable } from "react-native";
import { Activity } from "../../../@types/activity";
import { globalColors } from "../../../global/styles/globalColors";
import { processDistance } from "../../../utils/transformers/processDistance";
import { Ionicons } from "@expo/vector-icons";
import { formatTime } from "../../../utils/transformers/processTime";

export default function ActivityItem({
  activity,
  onActivityClick,
  onActivityLongPress,
}: {
  activity: Activity;
  onActivityClick: (activity: Activity) => void;
  onActivityLongPress: (id: string) => void;
}) {
  return (
    <Pressable
      key={activity.id}
      android_ripple={{
        color: "rgba(0, 0, 0, .1)",
      }}
      style={({ pressed }) => [pressed ? styles.pressed : null]}
      onPress={() => onActivityClick(activity)}
      onLongPress={() => onActivityLongPress(activity.id)}
    >
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <View style={styles.iconTitle}>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor:
                    activity.metadata.color ?? globalColors.primaryLightBlue,
                },
              ]}
            />
            <Text style={styles.description}>
              {activity.description.length > 26
                ? activity.description.substring(0, 26) + "..."
                : activity.description}
            </Text>
          </View>
          <View>
            <Ionicons
              name="chevron-forward-outline"
              size={24}
              color={globalColors.primaryGrey500}
            />
          </View>
        </View>
        <View>
          <Text style={styles.metadata}>
            {activity.type} - {processDistance(activity.distance)} -{" "}
            {formatTime(activity.duration)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: globalColors.primaryGrey100,
    paddingTop: 12,
    paddingBottom: 12,
    width: "95%",
    alignSelf: "center",
  },
  contentWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconTitle: {
    flexDirection: "row",
    width: "80%",
  },
  description: {
    fontSize: 22,
    fontWeight: "500",
  },
  metadata: {
    fontSize: 16,
    color: globalColors.primaryGrey500,
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 10,
    marginRight: 10,
    marginTop: 9,
  },
  pressed: {
    backgroundColor: "rgba(0, 0, 0, .05)",
  },
});
