import { View, Text, Pressable, StyleSheet } from "react-native";
import { Activity } from "../../../@types/activity";
import { Ionicons } from "@expo/vector-icons";
import { globalColors } from "../../../global/styles/globalColors";

export default function SelectedActivity({
  activity,
  deselectActivity,
}: {
  activity: Activity | null;
  deselectActivity: () => void;
}) {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
      }}
    >
      <Pressable
        key={activity!.id}
        android_ripple={{
          color: "rgba(0, 0, 0, .1)",
        }}
        style={({ pressed }) => [pressed ? styles.pressed : null]}
        onPress={deselectActivity}
      >
        <Ionicons
          name="arrow-back-outline"
          size={24}
          color={globalColors.primaryGreen}
          style={{
            borderWidth: 1,
            width: 24,
          }}
        />
      </Pressable>
      <View>
        <Text>{activity!.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pressed: {
    backgroundColor: "rgba(0, 0, 0, .05)",
  },
});
