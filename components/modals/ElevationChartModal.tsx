import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { Activity } from "../../@types/activity";
import { globalColors } from "../../global/styles/globalColors";
import ElevationChart from "../core/activities/ElevationChart";
import { Button } from "react-native-paper";
export default function ElevationChartModal({
  modalVisible,
  chartData,
  closeModal,
}: {
  modalVisible: boolean;
  chartData: Activity | null;
  closeModal: (shouldClose: boolean) => void;
}) {
  const windowHeight = Dimensions.get("window").height;

  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <View style={[styles.bottomSheet, { height: windowHeight * 0.42 }]}>
        <View style={{ justifyContent: "flex-start", flexDirection: "row" }}>
          <Button
            mode="text"
            onPress={() => closeModal(true)}
            icon="arrow-left"
            textColor={globalColors.primaryGreen}
            style={{
              paddingTop: 10,
            }}
          >
            Back
          </Button>
        </View>
        <ElevationChart activity={chartData!} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  pressed: {
    backgroundColor: "rgba(0, 0, 0, .05)",
  },
  bottomSheet: {
    position: "absolute",
    backgroundColor: globalColors.primaryLightBlue,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    bottom: 0,
    width: "100%",
  },
});
