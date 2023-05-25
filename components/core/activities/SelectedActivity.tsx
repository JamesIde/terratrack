import { View, Text, Pressable, StyleSheet } from "react-native";
import { Activity } from "../../../@types/activity";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from '@expo/vector-icons';
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
  return (
    <>
      <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
        <TouchableWithoutFeedback
          onPress={deselectActivity}
          style={{ marginLeft: 10 }}
        >
          <Ionicons
            name="md-chevron-back"
            size={24}
            color={globalColors.primaryGreen}
          />

        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback style={{
          marginRight: 16
        }}
        >
          <Entypo
            name="upload"
            size={24}
            color={globalColors.primaryGreen}
          />
        </TouchableWithoutFeedback>
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
  pressed: {
    backgroundColor: "rgba(0, 0, 0, .05)",
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
});

// style={({ pressed }) => [styles.icon, pressed ? styles.pressed : null]}
