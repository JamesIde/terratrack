import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { globalColors } from "../../global/styles/globalColors";
import { Entypo } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { mapStore } from "../../stores/mapStore";
import { MapStyleTypes } from "../../@types/mapStyleTypes";

export default function MapStyleButton() {
  const [mapStyle, toggleMapStyle] = mapStore((state) => [
    state.mapStyle,
    state.toggleMapStyle,
  ]);
  function handleStyleChange() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (mapStyle.TYPE === MapStyleTypes.SATELLITE) {
      toggleMapStyle(MapStyleTypes.TOPOGRAPHIC);
    } else {
      toggleMapStyle(MapStyleTypes.SATELLITE);
    }
  }

  return (
    <Pressable style={styles.container} onPress={handleStyleChange}>
      <View>
        <View style={[styles.background, { opacity: 1 }]}>
          {mapStyle.TYPE === MapStyleTypes.TOPOGRAPHIC ? (
            <Entypo name="globe" size={25} color="black" />
          ) : (
            <Ionicons name="globe-sharp" size={25} color="black" />
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: Dimensions.get("window").height * 0.03,
    right: 0,
    marginRight: Dimensions.get("window").width * 0.05,
    marginTop: Dimensions.get("window").height * 0.01,
  },
  background: {
    backgroundColor: globalColors.btnBackgroundOverlay,
    padding: 7,
    borderRadius: 25,
  },
});
