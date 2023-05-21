import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  Button,
  TextInput,
} from "react-native";
import { PreActivity } from "../../@types/activity";
import { useForm, Controller } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";
import { globalColors } from "../../global/styles/globalColors";
export default function BeforeYouStardActivityModal({
  modalVisible,
  closeModal,
}: {
  modalVisible: boolean;
  closeModal: (data: PreActivity) => void;
}) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: "",
      activityType: "",
    },
  });
  const onSubmit = (formData: any) => {
    closeModal(formData);
    reset({
      description: "",
      activityType: "",
    });
  };
  const activityTypes = [
    "Select an activity",
    "Running",
    "Cycling",
    "Walking",
    "Hiking",
  ];
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        closeModal({
          description: undefined,
          activityType: undefined,
        });
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.beforeStart}>Before You Start</Text>
          <View>
            <Controller
              control={control}
              rules={{
                required: true,
                maxLength: 100,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <Text style={styles.enterDescription}>
                    Enter a description
                  </Text>
                  <TextInput
                    placeholder="A description ..."
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={styles.descriptionInput}
                  />
                </>
              )}
              name="description"
            />
            {errors.description && (
              <Text style={styles.errorText}>A description is required</Text>
            )}

            <Controller
              control={control}
              rules={{
                required: "An activity type is required",
                validate: {
                  selectedActivity: (value) =>
                    value !== "Select an activity" ||
                    "An activity type is required",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <>
                  <Text style={styles.activityTypeText}>Activity Type</Text>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: globalColors.primaryGrey100,
                    }}
                  >
                    <Picker selectedValue={value} onValueChange={onChange}>
                      {activityTypes.map((type) => {
                        return (
                          <Picker.Item label={type} value={type} key={type} />
                        );
                      })}
                    </Picker>
                  </View>
                </>
              )}
              name="activityType"
            />
            {errors.activityType && (
              <Text style={styles.errorText}>
                {errors.activityType.message}
              </Text>
            )}
            <View style={styles.btnWrapper}>
              <Button title="Start" onPress={handleSubmit(onSubmit)} />
            </View>
            <View style={styles.btnWrapper}>
              <Button
                title="Cancel"
                onPress={() => {
                  closeModal({
                    description: undefined,
                    activityType: undefined,
                  });
                }}
                color={"red"}
              />
            </View>
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
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  beforeStart: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  enterDescription: {
    marginBottom: 10,
    fontWeight: "bold",
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: globalColors.primaryGrey100,
    paddingLeft: 10,
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
  activityTypeText: {
    marginBottom: 10,
    marginTop: 10,
    fontWeight: "bold",
  },
  btnWrapper: {
    marginTop: 15,
  },
});
