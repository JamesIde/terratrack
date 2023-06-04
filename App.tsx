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
export default Sentry.wrap(App);
