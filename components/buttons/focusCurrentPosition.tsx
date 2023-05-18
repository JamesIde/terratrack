import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import { trackingStore } from "../../stores/trackingStore";
import * as Haptics from "expo-haptics";
import { globalColors } from "../../global/styles/globalColors";
import { MaterialIcons } from "@expo/vector-icons";

export default function FocusCurrentPosition() {
  const [setFollowUser] = trackingStore((state) => [state.setFollowUser]);

  function handleCurrentPositionPress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFollowUser(false);

    // Allows Mapbox to catch up... why is this necessary?
    setTimeout(() => {
      setFollowUser(true);
    });
  }
  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <Pressable
          onPress={handleCurrentPositionPress}
          style={({ pressed }) => {
            return [pressed && styles.opacity];
          }}
        >
          <MaterialIcons name="my-location" size={30} color="black" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: "50%",
    right: 0,
    alignSelf: "flex-end",
    marginRight: Dimensions.get("window").width * 0.05,
  },
  background: {
    backgroundColor: globalColors.btnBackgroundOverlay,
    borderRadius: 50,
    padding: 5,
  },
  opacity: {
    opacity: 0.5,
  },
});
