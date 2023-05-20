import { View, Text, StyleSheet } from "react-native";

import ActivitySearchBar from "./ActivitySearchBar";
export default function ActivitySheetHeader() {
  return (
    <View style={styles.container}>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 26,
          marginBottom: 3,
        }}
      >
        All Routes
      </Text>
      <ActivitySearchBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    paddingHorizontal: 10,
  },
});
