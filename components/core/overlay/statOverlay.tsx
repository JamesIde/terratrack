import { View, Text, StyleSheet } from "react-native";
export default function StatOverlay() {
  return (
    <View style={styles.container}>
      <Text style={{}}>Stats will Go here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "rgba(52, 52, 52, 0.5)",
    opacity: 0.5,
    width: "100%",
  },
});
