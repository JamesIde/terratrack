import { View, Text, Modal, StyleSheet, Linking } from "react-native";
import { globalColors } from "../../global/styles/globalColors";
import { Button } from "react-native-paper";
import { useState } from "react";
export default function BatteryOptimizationModal({
  modalVisible,
  closeModal,
}: {
  modalVisible: boolean;
  closeModal: () => void;
}) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 10,
              marginTop: 10,
              textAlign: "center",
            }}
          >
            Battery Optimization
          </Text>
          <Text style={styles.textMargin}>
            The system has detected you are running on Android 7.0 or higher.
            These versions of Android introduce additional power management
            controls that cause the phone to enter a state of sleep while the
            application is unused.
          </Text>
          <Text style={styles.textMargin}>
            To provide accurate and continuous walking statistics, this app
            requires battery optimization to be turned off, or put into
            ‘unrestricted’ mode. This will allow location updates to persist for
            the duration of your activity even if the app is not in the
            foreground.
          </Text>
          <Text style={styles.textMargin}>
            To turn off battery optimization, please click the button below and
            navigate to the Battery settings. Then, select the 'Unrestricted'
            option.
          </Text>
          <Text style={styles.textMargin}>
            If you choose to dismiss this message, you can still record your
            activity. However, please be aware that your location statistics may
            be less accurate due to the automatic battery optimization performed
            by the operating system.
          </Text>
          <View style={styles.btnWrapper}>
            <Button
              mode="text"
              onPress={() =>
                setTimeout(() => {
                  closeModal();
                }, 100)
              }
              textColor={globalColors.primaryGreen}
            >
              Dismiss
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                closeModal();
                setTimeout(() => {
                  Linking.openSettings();
                }, 100);
              }}
              buttonColor={globalColors.primaryGreen}
            >
              Disable
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
  },
  modalView: {
    margin: 15,
    backgroundColor: globalColors.primaryLightBlue,
    borderRadius: 5,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textMargin: {
    marginBottom: 10,
    marginHorizontal: 10,
  },
  btnWrapper: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 10,
    marginTop: 10,
    paddingBottom: 15,
  },
});
