import { Button, StyleSheet } from "react-native";
import React, { useEffect, useRef } from "react";
import Mapbox, { Camera, MapView, UserLocation } from "@rnmapbox/maps";
import { CONFIG } from "../../../config/config";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../../../global/styles/globalStyles";
import { CameraRef } from "@rnmapbox/maps/lib/typescript/components/Camera";
import { mapStore } from "../../../stores/mapStore";
import { MapStyleTypes } from "../../../@types/mapStyleTypes";
Mapbox.setAccessToken(CONFIG.MAP.ACCESS_TOKEN);
export default function Map() {
  const cameraRef = useRef<CameraRef>(null);
  const mapRef = useRef<MapView>(null);
  const [mapStyle, toggleMapStyle] = mapStore((state) => [
    state.mapStyle,
    state.toggleMapStyle,
  ]);

  function pressMe() {
    if (mapStyle.TYPE === MapStyleTypes.SATELLITE) {
      toggleMapStyle(MapStyleTypes.TOPOGRAPHIC);
    } else {
      toggleMapStyle(MapStyleTypes.SATELLITE);
    }
  }

  return (
    <SafeAreaView style={globalStyles.safeViewContainer}>
      <Button title="click" onPress={pressMe} />
      <Mapbox.MapView
        style={styles.map}
        compassEnabled
        zoomEnabled={true}
        scaleBarEnabled={true}
        scrollEnabled={true}
        // We need to create sat/topo map in mapbox studio like in WAT app to do a switcher... Using WAT default for now
        styleURL={mapStyle.URL}
      >
        <Camera
          followUserLocation={true}
          ref={cameraRef}
          defaultSettings={CONFIG.MAP.DEFAULT_SETTINGS.SHEOAK}
          minZoomLevel={11.5}
          maxZoomLevel={18}
        />
        <UserLocation
          androidRenderMode="normal"
          requestsAlwaysUse
          showsUserHeadingIndicator={true}
        />
      </Mapbox.MapView>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
    marginBottom: "auto",
  },
  contentContainer: {
    backgroundColor: "white",
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },
});
