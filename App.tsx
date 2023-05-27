import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { globalStyles } from "./global/styles/globalStyles";
import ActivitySheet from "./components/core/activities/ActivitySheet";
import Map from "./components/core/mapbox/Map";
import { SafeAreaView } from "react-native-safe-area-context";
import Mapbox from "@rnmapbox/maps";

import * as Sentry from '@sentry/react-native';
import { CONFIG } from "./config/config";

Sentry.init({
  dsn: CONFIG.SENTRY.DSN,
});

Mapbox.requestAndroidLocationPermissions();
function App() {
  return (
    <SafeAreaView style={{ height: "100%" }}>
      <StatusBar style="auto" />
      <GestureHandlerRootView style={globalStyles.safeViewContainer}>
        <Map />
        <ActivitySheet />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

export default Sentry.wrap(App)