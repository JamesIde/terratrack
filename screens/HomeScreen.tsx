import { useState, useEffect } from "react";
import { View, Text, Platform, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ActivitySheet from "../components/core/activities/ActivitySheet";
import { globalStyles } from "../global/styles/globalStyles";
import Map from "../components/core/mapbox/Map";

export default function HomeScreen() {
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const checkPermissions = async () => {
    // TODO tidy this up
    let foreground = await Location.getForegroundPermissionsAsync();
    let bg = await Location.getBackgroundPermissionsAsync();
    console.log(`foreground ${JSON.stringify(foreground)}`);
    console.log(`background ${JSON.stringify(bg)}`);
    console.log(`step 1`);
    if (foreground.granted && bg.granted) {
      console.log(`step 2`);
      setPermissionsGranted(true);
      return;
    } else if (!foreground.granted && foreground.canAskAgain) {
      console.log(`step 3`);
      let fg = await Location.requestForegroundPermissionsAsync();
    }
    if (!bg.granted && bg.canAskAgain) {
      console.log(`step 4`);
      let bg = await Location.requestBackgroundPermissionsAsync();
    }
  };

  useEffect(() => {
    if (Platform.OS === "android") {
      checkPermissions();
    }
  }, [permissionsGranted]);
  return (
    <>
      {permissionsGranted ? (
        <GestureHandlerRootView style={globalStyles.safeViewContainer}>
          <Map />
          <ActivitySheet />
        </GestureHandlerRootView>
      ) : (
        <View style={{ marginTop: "50%" }}>
          <Text style={{ textAlign: "center" }}>Loading..</Text>
          <ActivityIndicator color="red" size="large" />
        </View>
      )}
    </>
  );
}
