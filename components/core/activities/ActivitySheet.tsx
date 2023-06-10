import { Text, StyleSheet, View, ScrollView } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useMemo, useCallback, useState, useEffect, useRef } from "react";
import { Dimensions } from "react-native";
import {
  deleteActivity,
  getActivities,
} from "../../../services/activity.service";
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
import DeleteActivityModal from "../../modals/DeleteActivityModal";
import * as Sentry from "@sentry/react-native";
import ElevationChartModal from "../../modals/ElevationChartModal";
import { searchStore } from "../../../stores/searchStore";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../@types/navigation";
export default function ActivitySheet() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  // Need to read up on useCallback and useMemo too. Been a while and don't fully understand whats happening here.
  const sheetRef = useRef<BottomSheet>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [chartModalVisible, setChartModalVisible] = useState(false);
  const [deleteActivityKey, setDeleteActivityKey] = useState("");
  const [fetchedData, setFetchedData] = useState<Activity[]>([]);
  const selectedSort = sortStore((state) => state.selectedSort);

  const [
    selectedActivity,
    navigatedFromAccount,
    chartData,
    setSelectedActivity,
    setElevationMetadata,
    setNavigatedFromAccount,
  ] = activityStore((state) => [
    state.selectedActivity,
    state.navigatedFromAccount,
    state.chartData,
    state.setSelectedActivity,
    state.setChartData,
    state.setNavigatedFromAccount,
  ]);
  const setFollowUser = trackingStore((state) => state.setFollowUser);
  const [search, setSearch] = searchStore((state) => [
    state.search,
    state.setSearch,
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
    handleElevationChart();
    fetchData();
  }, [chartData, selectedActivity]);

  const data = useMemo(() => {
    let sort = processActivitySorting(
      fetchedData,
      selectedSort,
      search
    ).reverse();
    return sort;
  }, [fetchedData, selectedSort, search]);

  const snapPoints = useMemo(() => {
    if (selectedActivity) {
      return ["45%"];
    } else {
      return ["5%", "45%", "90%"];
    }
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    // Closed sheet
    if (index === 0) {
      // Repeats here because the sheet is not updating the state in time
      setSelectedActivity(null);
    }
    fetchData();
  }, []);

  const onActivityClick = (activity: Activity) => {
    setSelectedActivity(activity);
    // Camera won't follow user, Map.tsx ref sets bounds to the Turf bbox
    setFollowUser(false);
    sheetRef.current?.snapToPosition("45");
  };

  const deselectActivity = () => {
    setSelectedActivity(null);
    setFollowUser(true);
    setSearch("");
    if (navigatedFromAccount) {
      setNavigatedFromAccount(false);
      navigation.navigate("Account");
      sheetRef.current?.snapToIndex(0);
    } else {
      sheetRef.current?.snapToIndex(2); // 80%
    }
  };

  const removeActivity = async (id: string) => {
    setDeleteModalVisible(true);
    setDeleteActivityKey(id);
  };

  const handleElevationChart = () => {
    if (chartData) {
      setChartModalVisible(true);
      sheetRef.current?.close();
    } else {
      if (selectedActivity) {
        sheetRef.current?.snapToIndex(1);
      }
    }
  };

  return (
    <>
      <BottomSheet
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        ref={sheetRef}
        backgroundStyle={{
          backgroundColor: globalColors.primaryLightBlue,
        }}
      >
        {!selectedActivity ? (
          <>
            <View style={styles.activityContainer}>
              <View
                style={{
                  flexDirection: "row-reverse",
                  justifyContent: "space-between",
                }}
              >
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
                    onActivityLongPress={removeActivity}
                  />
                )}
                style={styles.flatList}
              />
            ) : (
              <Text style={styles.activityText}>No activities found</Text>
            )}
          </>
        ) : (
          <>
            <SelectedActivity
              activity={selectedActivity}
              deselectActivity={deselectActivity}
            />
          </>
        )}
      </BottomSheet>
      <DeleteActivityModal
        modalVisible={deleteModalVisible}
        closeModal={async (shouldDelete) => {
          if (shouldDelete) {
            await deleteActivity(deleteActivityKey).then(() => fetchData());
          }
          setDeleteModalVisible(false);
        }}
      />
      <ElevationChartModal
        chartData={chartData}
        modalVisible={chartModalVisible}
        closeModal={(shouldClose) => {
          if (shouldClose) {
            setElevationMetadata(null);
            setChartModalVisible(false);
            sheetRef.current?.snapToIndex(1);
          }
        }}
      />
    </>
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
