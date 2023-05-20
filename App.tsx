import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { globalStyles } from "./global/styles/globalStyles";
import ActivitySheet from "./components/core/activities/ActivitySheet";
import Map from "./components/core/mapbox/Map";
import StatOverlay from "./components/core/overlay/statOverlay";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native";
import { clearActivities } from "./services/activity.service";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, height: "100%" }}>
      <StatusBar style="auto" />
      <GestureHandlerRootView style={globalStyles.safeViewContainer}>
        <Button title="clear" onPress={async () => await clearActivities()} />
        <Map />
        <ActivitySheet />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
