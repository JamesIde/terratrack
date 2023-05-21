import { View, StyleSheet, Dimensions, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { recordingStore } from "../../stores/recordingStore";
import { RecordingStateEnum } from "../../@types/enum/recordingStateEnum";
import { useEffect, useState } from "react";
import { activityTypeEnum } from "../../@types/enum/activityTypeEnum";
import { Activity, PreActivity } from "../../@types/activity";
import { processCoordinates } from "../../utils/transformers/processCoordinates";
import { processNewDate } from "../../utils/transformers/processDate";
import { processTime } from "../../utils/transformers/processTime";
import { addActivity } from "../../services/activity.service";
import { getRandomColor } from "../../utils/misc/getRandomColor";
import BeforeYouStardActivityModal from "../modals/BeforeYouStartModal";
import uuid from "react-native-uuid";
import { processElevation } from "../../utils/transformers/processElevation";

// This component is probably doing too much
export default function Recording() {
  const [locations, elevationArr, distance, recordingState, handleRecording] =
    recordingStore((state) => [
      state.locations,
      state.elevationArr,
      state.distance,
      state.recordingState,
      state.handleRecording,
    ]);
  const [timeData, setTimeData] = useState({
    elapsedTime: new Date(0),
    startTime: new Date(0),
    pausedTime: 0,
  });

  const [preActivityForm, setPreActivityForm] = useState({
    activityType: "",
    description: "",
  });

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (recordingState.isRecording) {
      interval = setInterval(() => {
        const currentTime = new Date();
        const elapsed =
          currentTime.getTime() -
          timeData.startTime.getTime() +
          timeData.pausedTime;
        setTimeData((prevState) => ({
          ...prevState,
          elapsedTime: new Date(elapsed),
        }));
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [recordingState.isRecording, timeData.startTime, timeData.pausedTime]);

  const startRecording = () => {
    setModalVisible(true);
  };

  const pauseRecording = () => {
    const currentTime = new Date();
    setTimeData((prevState) => ({
      ...prevState,
      pausedTime:
        prevState.pausedTime +
        currentTime.getTime() -
        prevState.startTime.getTime(),
    }));
    handleRecording(RecordingStateEnum.PAUSED);
  };

  const resumeRecording = () => {
    const currentTime = new Date();
    setTimeData((prevState) => ({
      ...prevState,
      startTime: currentTime,
    }));
    handleRecording(RecordingStateEnum.RECORDING);
  };

  const stopRecording = async () => {
    // TODO: show a saving-activity loader.

    // Need id as the activity object for key-extractor in flat list. id is also the key in async storage kv
    let id: string = uuid.v4().toString();
    let currentActivity: Activity = {
      description: preActivityForm.description,
      type: preActivityForm.activityType,
      coordinates: processCoordinates(locations),
      distance: distance,
      // TODO fix this function. Not returning time correctly
      duration: processTime(timeData.elapsedTime.getSeconds()),
      startTime: processNewDate(timeData.startTime),
      endTime: processNewDate(new Date()),
      metadata: {
        color: getRandomColor(),
      },
      elevation: processElevation(elevationArr),
      id,
    };
    await addActivity(currentActivity, id).then(() => {
      clearState();
    });
  };

  function clearState() {
    handleRecording(RecordingStateEnum.STOPPED);
    setTimeData((prevState) => ({
      ...prevState,
      elapsedTime: new Date(0),
      startTime: new Date(0),
      pausedTime: 0,
    }));
    console.log(`LOC ${locations.length}`);

    // TODO figure out why this is crashing the app
    // setTimeout(() => {
    // clearCurrentActivity();
    // }, 500);
  }

  // This triggers the actual recording of the data when the modal form submits
  function closeModal(preActivityData: PreActivity) {
    if (preActivityData.activityType && preActivityData.description) {
      setPreActivityForm({
        activityType: preActivityData.activityType!,
        description: preActivityData.description!,
      });
      const currentTime = new Date();
      setTimeData((prevState) => ({
        ...prevState,
        startTime: currentTime,
      }));
      handleRecording(RecordingStateEnum.RECORDING);
    }
    // Close it anyway (could be a cancel + undefined passed in as 'close')
    setModalVisible(false);
  }

  const renderIcons = () => {
    if (recordingState.isRecording) {
      // Show pause and stop
      return (
        <>
          <Ionicons
            name="stop-circle"
            size={45}
            color="grey"
            onPress={stopRecording}
          />
          <Ionicons
            name="pause-circle"
            size={45}
            color="red"
            onPress={pauseRecording}
          />
        </>
      );
    } else if (recordingState.isPaused) {
      // Show resume (start) and stop
      return (
        <>
          <Ionicons
            name="stop-circle"
            size={45}
            color="grey"
            onPress={stopRecording}
          />
          <MaterialCommunityIcons
            name="record-circle"
            size={45}
            color="red"
            onPress={resumeRecording}
          />
        </>
      );
    } else {
      // Default state when not recording or paused is to just show the start button
      return (
        <>
          <MaterialCommunityIcons
            name="record-circle"
            size={45}
            color="red"
            onPress={startRecording}
          />
        </>
      );
    }
  };

  return (
    <>
      <BeforeYouStardActivityModal
        modalVisible={modalVisible}
        closeModal={closeModal}
      />
      <View style={styles.container}>
        <Text>time: {timeData.elapsedTime.getTime()} in seconds</Text>
        <Text>locations: {locations.length}</Text>
        <Text>distance: {distance}</Text>
        {renderIcons()}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    position: "absolute",
    bottom: Dimensions.get("window").height * 0.05,
    flexDirection: "column",
    right: 0,
    marginRight: Dimensions.get("window").width * 0.05,
    gap: 2,
  },
});
