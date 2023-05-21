import { View, StyleSheet } from "react-native";
import ActivitySearchBar from "./ActivitySearchBar";
import ActivitySortButton from "../../buttons/ActivitySortButton";
import ActivitySheetHeader from "./ActivitySheetHeader";
export default function ActivitySheetHeaderWrapper() {
  return (
    <>
      <ActivitySortButton />
      <View style={styles.container}>
        <ActivitySheetHeader />
        <ActivitySearchBar />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
});
