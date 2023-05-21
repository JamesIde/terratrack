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
import { activityStore } from "../../../stores/activityStore";
export default function ActivitySheet() {
  // Need to read up on useCallback and useMemo too. Been a while and don't fully understand whats happening here.
  const sheetRef = useRef<BottomSheet>(null);
  const [fetchedData, setFetchedData] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = activityStore((state) => [
    state.selectedActivity,
    state.setSelectedActivity,
  ]);
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
    if (index === 0) {
      setSelectedActivity(null);
    }
    fetchData();
  }, []);

  const onActivityClick = (activity: Activity) => {
    sheetRef.current?.snapToIndex(1); // 50%
    setSelectedActivity(activity);
  };

  const deselectActivity = () => {
    sheetRef.current?.snapToIndex(2); // 80%
    setSelectedActivity(null);
  };

  return (
    <BottomSheet
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      ref={sheetRef}
      // Get the height of the bottom sheet
    >
      {!selectedActivity ? (
        <>
          <ActivitySheetHeaderWrapper />
          {data.length > 0 ? (
            <BottomSheetFlatList
              data={data}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => (
                <ActivityItem
                  activity={item}
                  onActivityClick={onActivityClick}
                />
              )}
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
          activity={selectedActivity}
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
