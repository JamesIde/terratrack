import { Text, StyleSheet, View } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useMemo, useCallback, useState, useEffect, useRef } from "react";
import { Dimensions } from "react-native";
import { getActivities } from "../../../services/activity.service";
import { Activity } from "../../../@types/activity";
import { ShowAlert } from "../../../utils/alert/alert";
import { activityStore } from "../../../stores/activityStore";
import { trackingStore } from "../../../stores/trackingStore";
import ActivitySortButton from "../../buttons/ActivitySortButton";
import ActivitySearchBar from "./ActivitySearchBar";
import ActivitySheetHeader from "./ActivitySheetHeader";
import ActivityItem from "./ActivityItem";
import SelectedActivity from "./SelectedActivity";
import { globalColors } from "../../../global/styles/globalColors";
import { sortStore } from "../../../stores/sortStore";
import { processActivitySorting } from "../../../utils/transformers/processActivitySorting";
export default function ActivitySheet() {
  // Need to read up on useCallback and useMemo too. Been a while and don't fully understand whats happening here.
  const sheetRef = useRef<BottomSheet>(null);
  const [fetchedData, setFetchedData] = useState<Activity[]>([]);
  const selectedSort = sortStore(state => state.selectedSort)
  const [selectedActivity, setSelectedActivity] = activityStore((state) => [
    state.selectedActivity,
    state.setSelectedActivity,
  ]);
  const setFollowUser = trackingStore((state) => state.setFollowUser);
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
    return processActivitySorting(fetchedData, selectedSort).reverse()
  }, [fetchedData, selectedSort]);

  const snapPoints = useMemo(() => ["5%", "50%", "90%"], []);

  const handleSheetChanges = useCallback((index: number) => {
    // Closed sheet
    if (index === 0) {
      // Repeats here because the sheet is not updating the state in time
      setFollowUser(true);
      setSelectedActivity(null);
    }
    fetchData();
  }, []);

  const onActivityClick = (activity: Activity) => {
    setSelectedActivity(activity);
    // Camera won't follow user, Map.tsx ref sets bounds to the Turf bbox
    setFollowUser(false);
    sheetRef.current?.snapToIndex(1); // 50%
  };

  const deselectActivity = () => {
    setSelectedActivity(null);
    // Returns camera view to user location
    setFollowUser(true);
    sheetRef.current?.snapToIndex(2); // 80%
  };


  return (
    <BottomSheet
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      ref={sheetRef}
      backgroundStyle={{
        backgroundColor: globalColors.primaryLightBlue
      }}
    >
      {!selectedActivity ? (
        <>
          <View style={styles.activityContainer}>
            <View style={{
              flexDirection: "row-reverse", justifyContent: "space-between"
            }}>
              <ActivitySortButton />
              <ActivitySheetHeader />
            </View>
            <ActivitySearchBar />
          </View>
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
            <Text style={styles.activityText}>No activities found</Text>
          )}
        </>
      ) : (
        // <BottomSheetScrollView>
        //   <NativeViewGestureHandler disallowInterruption={true}>
        <SelectedActivity
          activity={selectedActivity}
          deselectActivity={deselectActivity}
        />
        //   </NativeViewGestureHandler>
        // </BottomSheetScrollView>
      )}
    </BottomSheet>
  );
}

export const styles = StyleSheet.create({
  flatList: {
    marginBottom: Dimensions.get("window").height * 0.01,
  },
  activityText: {
    textAlign: "center",
  },
  activityContainer: {
    paddingHorizontal: 10,
    marginTop: Dimensions.get("window").height * 0.02,
  },
});
