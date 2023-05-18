import { View, Text, StyleSheet, Dimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

export default function Recording() {
  return (
    <View style={styles.container}>
      <Ionicons name="stop-circle" size={45} color="grey" />
      <MaterialCommunityIcons name="record-circle" size={45} color="red" />
      <Ionicons name="pause-circle" size={45} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: Dimensions.get("window").height * 0.05,
    flexDirection: "row",
    right: 0,
    marginRight: Dimensions.get("window").width * 0.05,
    gap: 2,
  },
});
