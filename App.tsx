import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Map from "./component/mapbox/Map";

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <Map />
    </>
  );
}
