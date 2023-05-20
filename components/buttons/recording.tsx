import { View, StyleSheet, Dimensions, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { recordingStore } from "../../stores/recordingStore";
import { RecordingStateEnum } from "../../@types/enum/recordingStateEnum";
import { useEffect, useState } from "react";
import { activityTypeEnum } from "../../@types/enum/activityTypeEnum";
import { Activity } from "../../@types/activity";
import { processCoordinates } from "../../utils/transformers/processCoordinates";
import { processNewDate } from "../../utils/transformers/processDate";
import { toTime } from "../../utils/transformers/processTime";
import { addActivity } from "../../services/activity.service";

// This component is probably doing too much
export default function Recording() {
  const [
    locations,
    distance,
    recordingState,
    handleRecording,
    clearCurrentActivity,
  ] = recordingStore((state) => [
    state.locations,
    state.distance,
    state.recordingState,
    state.handleRecording,
    state.clearCurrentActivity,
  ]);
  // COMBINE THESE!!! Ugly
  const [elapsedTime, setElapsedTime] = useState<Date>(new Date(0));
  const [startTime, setStartTime] = useState<Date>(new Date(0));
  const [pausedTime, setPausedTime] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (recordingState.isRecording) {
      interval = setInterval(() => {
        const currentTime = new Date();
        const elapsed =
          currentTime.getTime() - startTime.getTime() + pausedTime;
        setElapsedTime(new Date(elapsed));
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [recordingState.isRecording, startTime, pausedTime]);

  const startRecording = () => {
    const currentTime = new Date();
    setStartTime(currentTime);
    handleRecording(RecordingStateEnum.RECORDING);
  };

  const pauseRecording = () => {
    const currentTime = new Date();
    setPausedTime(
      (prevPausedTime) =>
        prevPausedTime + currentTime.getTime() - startTime.getTime()
    );

    handleRecording(RecordingStateEnum.PAUSED);
  };

  const resumeRecording = () => {
    const currentTime = new Date();
    setStartTime(currentTime);
    handleRecording(RecordingStateEnum.RECORDING);
  };

  const stopRecording = async () => {
    clearState();
    // TODO: show a saving-activity loader.
    // TODO also - Activity picking modal and description
    let currentActivity: Activity = {
      description: "Test walk around the block",
      type: activityTypeEnum.WALKING,
      coordinates: processCoordinates(locations),
      distance: distance,
      duration: toTime(elapsedTime.getSeconds()),
      startTime: processNewDate(startTime),
      endTime: processNewDate(new Date()),
    };
    await addActivity(currentActivity);
  };

  function clearState() {
    clearCurrentActivity();
    handleRecording(RecordingStateEnum.STOPPED);
    setElapsedTime(new Date(0));
    setStartTime(new Date(0));
    setPausedTime(0);
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
    <View style={styles.container}>
      <Text>time: {elapsedTime.getSeconds()} in seconds</Text>
      <Text>locations: {locations.length}</Text>
      <Text>distance: {distance}</Text>
      {renderIcons()}
    </View>
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
