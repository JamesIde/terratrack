import { View, Text, StyleSheet } from "react-native";
import Mapbox from "@rnmapbox/maps";
import { CONFIG } from "../../config/config";
import { SafeAreaView } from "react-native-safe-area-context";

Mapbox.requestAndroidLocationPermissions();
Mapbox.setAccessToken(CONFIG.MAP.ACCESS_TOKEN);
export default function Map() {
  return (
    <SafeAreaView style={styles.container}>
      <Mapbox.MapView
        style={styles.map}
        // styleURL={CONFIG.MAP.TOPOGRAPHIC.URL}
        compassEnabled
        zoomEnabled={true}
        scaleBarEnabled={true}
        scrollEnabled={true}
      />
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
    marginBottom: "auto",
  },
});
