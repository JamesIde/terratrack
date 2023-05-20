import { View, Text, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useMemo, useCallback, useState, useEffect } from "react";
import { Dimensions } from "react-native";
import { getActivities, getKeys } from "../../../services/activity.service";
import { Activity } from "../../../@types/activity";
import { ShowAlert } from "../../../utils/alert/alert";
import ActivityItem from "./ActivityItem";
export default function ActivitySheet() {
  // Need to read up on useCallback and useMemo too. Been a while and don't fully understand whats happening here.
  const [fetchedData, setFetchedData] = useState<Activity[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const activities = await getActivities();
      setFetchedData(activities);
    } catch (error) {
      ShowAlert("Error", error.message, [{ text: "OK" }]);
    }
  }, []);

  useEffect(() => {
    fetchData();
    console.log(`use eff re-render`);
  }, [getActivities]);

  const data = useMemo(() => {
    return fetchedData.map((item) => item);
  }, [fetchedData]);

  const snapPoints = useMemo(() => ["5%", "80%"], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("sheet changed, fetching");
    fetchData();
  }, []);

  const handleRefresh = useCallback(async () => {
    console.log(await getKeys());
  }, []);

  return (
    <BottomSheet snapPoints={snapPoints} onChange={handleSheetChanges}>
      <BottomSheetFlatList
        data={data}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => <ActivityItem activity={item} />}
        contentContainerStyle={styles.container}
        refreshing={false}
        onRefresh={handleRefresh}
        style={styles.flatList}
      />
    </BottomSheet>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    marginBottom: Dimensions.get("window").height * 0.01,
    marginTop: Dimensions.get("window").height * 0.04,
  },
});
