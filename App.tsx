import "react-native-gesture-handler";
import { ActivityIndicator, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { globalStyles } from "./global/styles/globalStyles";
import { PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { CONFIG } from "./config/config";
import Map from "./components/core/mapbox/Map";
import Mapbox from "@rnmapbox/maps";
import * as Sentry from "@sentry/react-native";
import ActivitySheet from "./components/core/activities/ActivitySheet";
import { Platform } from "react-native";
import { Permission, PermissionsAndroid } from "react-native";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
Sentry.init({
  dsn: CONFIG.SENTRY.DSN,
});
function App() {
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  const checkPermissions = async () => {
    let foreground = await Location.getForegroundPermissionsAsync();
    console.log(foreground);

    if (foreground.granted) {
      setPermissionsGranted(true);
      return;
    } else if (!foreground.granted && foreground.canAskAgain) {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // TODO show alert
        console.log("Permission not granted");
        return;
      }
      setPermissionsGranted(true);
    }
  };

  useEffect(() => {
    if (Platform.OS === "android") {
      checkPermissions();
    }
  }, []);
  return (
    <>
      {permissionsGranted ? (
        <PaperProvider>
          <SafeAreaView style={{ height: "100%" }}>
            <StatusBar style="auto" />
            <GestureHandlerRootView style={globalStyles.safeViewContainer}>
              <Map />
              <ActivitySheet />
            </GestureHandlerRootView>
          </SafeAreaView>
        </PaperProvider>
      ) : (
        <View style={{ marginTop: "50%" }}>
          <Text style={{ textAlign: "center" }}>Loading..</Text>
          <ActivityIndicator color="red" size="large" />
        </View>
      )}
    </>
  );
}

/**
 * 
    let backPerm = await Location.requestBackgroundPermissionsAsync();
    if (backPerm.status === "granted") {
      console.log(`back granted`);
    } else {
      // TODO show alert
      console.log("Permission not granted");
    }
 */

export default Sentry.wrap(App);
