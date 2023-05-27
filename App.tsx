import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { globalStyles } from "./global/styles/globalStyles";
import { PaperProvider } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";
import { CONFIG } from "./config/config";
import Map from "./components/core/mapbox/Map";
import Mapbox from "@rnmapbox/maps";
import * as Sentry from '@sentry/react-native';
import ActivitySheet from "./components/core/activities/ActivitySheet";

Sentry.init({
  dsn: CONFIG.SENTRY.DSN,
});

Mapbox.requestAndroidLocationPermissions();
function App() {
  return (
    <PaperProvider>
      <SafeAreaView style={{ height: "100%" }}>
        <StatusBar style="auto" />
        <GestureHandlerRootView style={globalStyles.safeViewContainer}>
          <Map />
          <ActivitySheet />
        </GestureHandlerRootView>
      </SafeAreaView>
    </PaperProvider>
  );
}

export default Sentry.wrap(App)