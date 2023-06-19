import { View, Text, Modal, StyleSheet } from "react-native";
import { globalColors } from "../../global/styles/globalColors";
import { Button } from "react-native-paper";
export default function DeleteActivityModal({
  modalVisible,
  closeModal,
}: {
  modalVisible: boolean;
  closeModal: (shouldDelete: boolean) => void;
}) {
  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {
        closeModal(false);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text
            style={{
              textAlign: "center",
            }}
          >
            Are you sure you want to remove this item?
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginTop: 10,
            }}
          >
            <Button mode="text" onPress={() => closeModal(false)}>
              Close
            </Button>
            <Button mode="text" onPress={() => closeModal(true)}>
              <Text
                style={{
                  fontWeight: "bold",
                  color: "red",
                }}
              >
                Remove
              </Text>
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
    backgroundColor: "rgba(52, 52, 52, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: globalColors.primaryWhite,
    borderRadius: 5,
    shadowColor: "#000",
    paddingTop: 30,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
});
