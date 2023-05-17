import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { globalStyles } from "./global/styles/globalStyles";
import Activity from "./components/core/activities/Activity";
import Map from "./components/core/mapbox/Map";

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <GestureHandlerRootView style={globalStyles.safeViewContainer}>
        <Map />
        <Activity />
      </GestureHandlerRootView>
    </>
  );
}
