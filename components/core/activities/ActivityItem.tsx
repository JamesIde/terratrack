import { View, Text } from "react-native";
import { Activity } from "../../../@types/activity";
export default function ActivityItem({ activity }: { activity: Activity }) {
  return (
    <View>
      <Text>{activity.id}</Text>
    </View>
  );
}
