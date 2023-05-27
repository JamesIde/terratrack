import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";
import { PreActivity } from "../../@types/activity";
import { useForm, Controller } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";
import { globalColors } from "../../global/styles/globalColors";
import { MaterialCommunityIcons } from "@expo/vector-icons"
import React, { useState } from "react";
import { Button } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
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
      activity: "",
    },
  });

  const [iconError, setIconError] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('Walk');

  const handleIconPress = (iconName: string) => {
    setSelectedIcon(iconName);
  };

  const isIconSelected = (iconName: string) => {
    return selectedIcon === iconName;
  };

  // Sorry typescript...
  const onSubmit = (formData: any) => {
    if (!selectedIcon || selectedIcon === '') {
      setIconError("An activity type is required.")
      return;
    }
    formData.activity = selectedIcon
    closeModal(formData);
    reset({
      description: "",
      activity: ""
    });
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        closeModal({
          description: undefined,
          activity: undefined,
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
                  <Text style={styles.activityTitle}>
                    Activity Title
                  </Text>
                  <TextInput
                    placeholder="A quick run in the park..."
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
            <View style={{
              backgroundColor: globalColors.primaryLightBlue,
              borderRadius: 10,
              height: 120,
              marginTop: 10
            }}>
              <Text style={{
                textAlign: "center",
                marginTop: 10,
                marginBottom: 10,
                fontWeight: "bold",
                color: globalColors.primaryDarkBlue,
                fontSize: 16
              }}>
                Choose an Activity
              </Text>
              <View style={styles.container}>
                <View
                  style={[
                    styles.iconWrapper,
                  ]}
                >
                  <Pressable onPress={() => {
                    handleIconPress('Running')
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}>
                    <View style={
                      isIconSelected('Running') && styles.iconContainer
                    }>
                      <MaterialCommunityIcons name="run" size={30} color="black" />
                    </View>
                  </Pressable>
                </View>
                <View
                  style={[
                    styles.iconWrapper,

                  ]}
                >
                  <Pressable onPress={() => {
                    handleIconPress('Cycling')
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}>
                    <View style={
                      isIconSelected('Cycling') && styles.iconContainer
                    }>
                      <MaterialCommunityIcons name="bike" size={30} color="black" />
                    </View>
                  </Pressable>
                </View>
                <View
                  style={[
                    styles.iconWrapper,
                  ]}
                >
                  <Pressable onPress={() => {
                    handleIconPress('Walking')
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}>
                    <View style={
                      isIconSelected('Walking') && styles.iconContainer
                    }>
                      <MaterialCommunityIcons name="walk" size={30} color="black" />
                    </View>
                  </Pressable>
                </View>
                <View
                  style={[
                    styles.iconWrapper,
                  ]}
                >
                  <Pressable onPress={() => {
                    handleIconPress('Hiking')
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}>
                    <View style={
                      isIconSelected('Hiking') && styles.iconContainer
                    }>
                      <MaterialCommunityIcons name="hiking" size={30} color="black" />
                    </View>
                  </Pressable>
                </View>
              </View>
            </View>
            <View>
              {iconError !== "" && <>
                <Text style={{
                  color: "red"
                }}>
                  {iconError}
                </Text>
              </>}
            </View>

            <View style={{
              flexDirection: "column",
              justifyContent: "center",
              marginTop: 20,
              gap: 10
            }}>
              <Button mode="contained" onPress={handleSubmit(onSubmit)}>
                Start
              </Button>
              <Button mode="contained-tonal" onPress={() => closeModal({
                description: undefined,
                activity: undefined,
              })}>
                Cancel
              </Button>
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
    backgroundColor: globalColors.primaryWhite,
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
    color: globalColors.primaryDarkBlue
  },
  activityTitle: {
    marginBottom: 10,
    fontWeight: "bold",
    color: globalColors.primaryDarkBlue
  },
  descriptionInput: {
    backgroundColor: globalColors.primaryLightBlue,
    paddingLeft: 10,
    borderRadius: 5,
    padding: 5,
    color: globalColors.primaryDarkBlue
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
  startBtn: {
    marginTop: 15,
    width: "100%",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
    backgroundColor: globalColors.primaryLightBlue
  },
  cancelBtn: {
    marginTop: 15,
    width: "100%",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
    backgroundColor: globalColors.primaryLightBlue
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 10,

  },
  iconWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
