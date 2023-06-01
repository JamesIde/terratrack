import { View, StyleSheet, Dimensions } from "react-native";
import { IconButton } from "react-native-paper";
import { recordingStore } from "../../stores/recordingStore";
import { RecordingStateEnum } from "../../@types/enum/recordingStateEnum";
import { useEffect, useState } from "react";
import { Activity, PreActivity } from "../../@types/activity";
import { processCoordinates } from "../../utils/transformers/processCoordinates";
import { addActivity } from "../../services/activity.service";
import { getRandomColor } from "../../utils/misc/getRandomColor";
import { processElevation } from "../../utils/transformers/processElevation";
import { transformCoord } from "../../utils/transformers/processCoord";
import { trackingStore } from "../../stores/trackingStore";
import BeforeYouStardActivityModal from "../modals/BeforeYouStartModal";
import uuid from "react-native-uuid";
import StatOverlay from "../core/overlay/statOverlay";
// TODO the elapsed time is still broken
// This component is probably doing too much. Its probably the worst code I've ever written.
export default function Recording() {
  const [
    locations,
    elevationArr,
    distance,
    recordingState,
    handleRecording,
    updateDistance,
    updateElevation,
  ] = recordingStore((state) => [
    state.locations,
    state.elevationArr,
    state.distance,
    state.recordingState,
    state.handleRecording,
    state.updateDistance,
    state.updateElevation,
  ]);
  const [followUser, setFollowUser] = trackingStore((state) => [
    state.followUser,
    state.setFollowUser,
  ]);

  const [preActivityForm, setPreActivityForm] = useState({
    activityType: "",
    description: "",
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [timeData, setTimeData] = useState({
    elapsedTime: 0,
    startTime: new Date(0),
    pausedTime: 0,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (recordingState.isRecording) {
      interval = setInterval(() => {
        const currentTime = new Date();
        const elapsedInSeconds = Math.floor(
          (currentTime.getTime() -
            timeData.startTime.getTime() +
            timeData.pausedTime) /
            1000
        );
        setTimeData((prevState) => ({
          ...prevState,
          elapsedTime: elapsedInSeconds,
        }));
      }, 1000);
      if (!followUser) {
        setFollowUser(true);
      }
    }

    return () => {
      clearInterval(interval);
    };
  }, [
    recordingState.isRecording,
    timeData.startTime,
    timeData.pausedTime,
    locations,
  ]);

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
    // Need id as the activity object for key-extractor in flat list. id is also the key in async storage kv
    let id: string = uuid.v4().toString();
    console.log(`total seconds ${timeData.elapsedTime}`);
    let currentActivity: Activity = {
      description: preActivityForm.description,
      type: preActivityForm.activityType,
      coordinates: processCoordinates(locations),
      distance: distance,
      duration: timeData.elapsedTime,
      startTime: timeData.startTime,
      endTime: new Date(),
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
      elapsedTime: 0,
      startTime: new Date(0),
      pausedTime: 0,
    }));
  }

  // This triggers the actual recording of the data when the modal form submits
  function closeModal(preActivityData: PreActivity) {
    if (preActivityData.activity && preActivityData.description) {
      setPreActivityForm({
        activityType: preActivityData.activity!,
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
          <IconButton
            icon="stop-circle"
            size={45}
            iconColor="grey"
            onPress={stopRecording}
          />
          <IconButton
            icon="pause-circle"
            size={45}
            iconColor="red"
            onPress={pauseRecording}
          />
        </>
      );
    } else if (recordingState.isPaused) {
      // Show resume (start) and stop
      return (
        <>
          <IconButton
            icon="stop-circle"
            size={45}
            iconColor="grey"
            onPress={stopRecording}
          />
          <IconButton
            icon="record-circle"
            size={45}
            iconColor="red"
            onPress={resumeRecording}
          />
        </>
      );
    } else {
      // Default state when not recording or paused is to just show the start button
      return (
        <>
          <IconButton
            icon="record-circle"
            size={45}
            onPress={startRecording}
            iconColor="red"
          />
        </>
      );
    }
  };

  return (
    <>
      <StatOverlay
        distance={distance}
        timeInSeconds={timeData.elapsedTime}
        recordingState={recordingState}
        locations={locations}
      />
      <BeforeYouStardActivityModal
        modalVisible={modalVisible}
        closeModal={closeModal}
      />
      <View style={styles.container}>{renderIcons()}</View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: Dimensions.get("window").height * 0.05,
    flexDirection: "row",
    right: 0,
    marginRight: Dimensions.get("window").width * 0.05,
    gap: 2,
  },
});
