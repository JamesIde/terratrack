import { View, Text, StyleSheet } from "react-native";
export default function ActivitySheetHeader() {
  return (
    <>
      <Text style={styles.header}>All Routes</Text>
    </>
  );
}

export const styles = StyleSheet.create({
  header: {
    fontWeight: "bold",
    fontSize: 30,
    marginBottom: 3,
  },
});
