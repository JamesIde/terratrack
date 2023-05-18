import { View, StyleSheet, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { recordingStore } from "../../stores/recordingStore";
import { RecordingStateEnum } from "../../@types/enum/recordingStateEnum";

export default function Recording() {
  /**
   * By default, we want to show the recording icon.
   * Click recording --> show activity modal ---> show pause button
   * Click pause --> check if locations > 2 ? show button : nothing
   * Click stop --> format trail, store in mmkv, show recording button
   * */
  const [recordingState, handleRecording] = recordingStore((state) => [
    state.recordingState,
    state.handleRecording,
  ]);

  const renderIcons = () => {
    if (recordingState.isRecording) {
      return (
        <>
          <Ionicons
            name="stop-circle"
            size={45}
            color="grey"
            onPress={() => handleRecording(RecordingStateEnum.STOPPED)}
          />
          <Ionicons
            name="pause-circle"
            size={45}
            color="red"
            onPress={() => handleRecording(RecordingStateEnum.PAUSED)}
          />
        </>
      );
    } else if (recordingState.isPaused) {
      return (
        <>
          <Ionicons
            name="stop-circle"
            size={45}
            color="grey"
            onPress={() => handleRecording(RecordingStateEnum.STOPPED)}
          />
          <MaterialCommunityIcons
            name="record-circle"
            size={45}
            color="red"
            onPress={() => handleRecording(RecordingStateEnum.RECORDING)}
          />
        </>
      );
    } else {
      // Default state when not recording or paused
      return (
        <>
          <MaterialCommunityIcons
            name="record-circle"
            size={45}
            color="red"
            onPress={() => handleRecording(RecordingStateEnum.RECORDING)}
          />
        </>
      );
    }
  };

  return <View style={styles.container}>{renderIcons()}</View>;
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
