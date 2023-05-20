import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { globalColors } from "../../../global/styles/globalColors";
import ActivitySearchBar from "./ActivitySearchBar";
import ActivitySortButton from "./ActivitySortButton";
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
