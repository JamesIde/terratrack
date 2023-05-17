import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { globalStyles } from "./global/styles/globalStyles";
import Activity from "./components/core/activities/Activity";
import Map from "./components/core/mapbox/Map";
import StatOverlay from "./components/core/overlay/statOverlay";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, height: "100%" }}>
      <StatusBar style="auto" />
      <GestureHandlerRootView style={globalStyles.safeViewContainer}>
        <Map />
        {/* <Activity /> */}
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
