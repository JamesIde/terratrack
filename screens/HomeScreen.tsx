import { useState, useEffect } from "react";
import { View, Text, Platform, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ActivitySheet from "../components/core/activities/ActivitySheet";
import { globalStyles } from "../global/styles/globalStyles";
import Map from "../components/core/mapbox/Map";
import Loading from "../components/common/Loading";

export default function HomeScreen() {
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const checkPermissions = async () => {
    // TODO tidy this up
    let foreground = await Location.getForegroundPermissionsAsync();
    if (foreground.granted) {
      setPermissionsGranted(true);
      return;
    } else if (!foreground.granted && foreground.canAskAgain) {
      await Location.requestForegroundPermissionsAsync().then((res) => {
        console.log(`requestForegroundPermissionsAsync ${JSON.stringify(res)}`);
        if (res.granted) {
          setPermissionsGranted(true);
          return;
        }
      });
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
        <Loading marginTop="50" />
      )}
    </>
  );
}
