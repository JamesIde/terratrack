import { View, StyleSheet, Dimensions, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { recordingStore } from "../../stores/recordingStore";
import { RecordingStateEnum } from "../../@types/enum/recordingStateEnum";
import { useEffect, useState } from "react";
import { activityTypeEnum } from "../../@types/enum/activityTypeEnum";

export default function Recording() {
  const [locations, distance, recordingState, handleRecording] = recordingStore(
    (state) => [
      state.locations,
      state.distance,
      state.recordingState,
      state.handleRecording,
    ]
  );
  // COMBINE THESE!!! Ugly
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [pausedTime, setPausedTime] = useState<number>(0);

  // This will come from a modal at some point
  let activity = activityTypeEnum.WALKING;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (recordingState.isRecording && locations.length > 2) {
      interval = setInterval(() => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime + pausedTime;
        setElapsedTime(elapsed);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [recordingState.isRecording, startTime, pausedTime]);

  const startRecording = () => {
    const currentTime = Date.now();
    setStartTime(currentTime);
    handleRecording(RecordingStateEnum.RECORDING);
  };

  const pauseRecording = () => {
    const currentTime = Date.now();
    setPausedTime((prevPausedTime) => prevPausedTime + currentTime - startTime);
    handleRecording(RecordingStateEnum.PAUSED);
  };

  const resumeRecording = () => {
    const currentTime = Date.now();
    setStartTime(currentTime);
    handleRecording(RecordingStateEnum.RECORDING);
  };

  const stopRecording = () => {
    setElapsedTime(0);
    setStartTime(0);
    setPausedTime(0);
    handleRecording(RecordingStateEnum.STOPPED);
  };

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
      <Text>time: {elapsedTime} in miliseconds</Text>
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
