import { View, Text, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useMemo, useCallback, useState, useEffect, useRef } from "react";
import { Dimensions } from "react-native";
import { getActivities, getKeys } from "../../../services/activity.service";
import { Activity } from "../../../@types/activity";
import { ShowAlert } from "../../../utils/alert/alert";
import ActivityItem from "./ActivityItem";
import ActivitySheetHeaderWrapper from "./ActivitySheetHeaderWrapper";
import { useSharedValue } from "react-native-reanimated";
import SelectedActivity from "./SelectedActivity";
export default function ActivitySheet() {
  // Need to read up on useCallback and useMemo too. Been a while and don't fully understand whats happening here.
  const sheetRef = useRef<BottomSheet>(null);
  const animatedIndex = useSharedValue(0);
  const [fetchedData, setFetchedData] = useState<Activity[]>([]);
  const [activity, setActivity] = useState<Activity | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const activities = await getActivities();
      setFetchedData(activities);
    } catch (error) {
      let errorMessage = "An error occured";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      ShowAlert("Error", errorMessage, [{ text: "OK" }]);
    }
  }, []);

  useEffect(() => {
    fetchData();
    console.log(`use eff re-render`);
  }, []);

  const data = useMemo(() => {
    return fetchedData.map((item) => item);
  }, [fetchedData]);

  const snapPoints = useMemo(() => ["5%", "50%", "80%"], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("sheet changed, fetching");
    fetchData();
  }, []);

  const handleRefresh = useCallback(async () => {
    console.log(await getKeys());
  }, []);

  const handleSnapPress = useCallback((index: number) => {
    sheetRef.current?.snapToIndex(index);
  }, []);

  const selectedActivity = (activity: Activity) => {
    handleSnapPress(1); // 50%
    setActivity(activity);
  };

  const deselectActivity = () => {
    handleSnapPress(2); // 80%
    setActivity(null);
  };

  return (
    <BottomSheet
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      animatedIndex={animatedIndex}
      ref={sheetRef}
    >
      {!activity ? (
        <>
          <ActivitySheetHeaderWrapper />
          {data.length > 0 ? (
            <BottomSheetFlatList
              data={data}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => (
                <ActivityItem activity={item} onSelection={selectedActivity} />
              )}
              refreshing={false}
              onRefresh={handleRefresh}
              style={styles.flatList}
            />
          ) : (
            <Text
              style={{
                textAlign: "center",
              }}
            >
              No activities found
            </Text>
          )}
        </>
      ) : (
        <SelectedActivity
          activity={activity}
          deselectActivity={deselectActivity}
        />
      )}
    </BottomSheet>
  );
}

export const styles = StyleSheet.create({
  flatList: {
    marginBottom: Dimensions.get("window").height * 0.01,
  },
});
