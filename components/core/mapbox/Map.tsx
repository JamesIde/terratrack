import { Button, Dimensions, StyleSheet, View } from "react-native";
import React, { useEffect, useRef } from "react";
import Mapbox, {
  Camera,
  LineLayer,
  MapView,
  PointAnnotation,
  ShapeSource,
  UserLocation,
  UserLocationRenderMode,
} from "@rnmapbox/maps";
import { CONFIG } from "../../../config/config";
import { CameraRef } from "@rnmapbox/maps/lib/typescript/components/Camera";
import { mapStore } from "../../../stores/mapStore";
import FocusCurrentPosition from "../../buttons/FocusCurrentPosition";
import { trackingStore } from "../../../stores/trackingStore";
import Recording from "../../buttons/Recording";
import StatOverlay from "../overlay/statOverlay";
import MapStyleButton from "../../buttons/MapStyle";
import { recordingStore } from "../../../stores/recordingStore";
import CurrentShapeSource from "./CurrentShapeSource";
Mapbox.setAccessToken(CONFIG.MAP.ACCESS_TOKEN);
Mapbox.requestAndroidLocationPermissions();
export default function Map() {
  const cameraRef = useRef<CameraRef>(null);
  const mapRef = useRef<MapView>(null);
  const mapStyle = mapStore((state) => state.mapStyle);
  const [recordingState, updateLocation] = recordingStore((state) => [
    state.recordingState,
    state.updateLocation,
  ]);
  const followUser = trackingStore((state) => state.followUser);
  // The coordinates for point annotation follow [longitude, latitude]. Longitude is the bigger number (138), latitude is the smaller number (-35).

  return (
    <>
      <Mapbox.MapView
        style={styles.map}
        compassEnabled
        compassPosition={{
          top: Dimensions.get("window").height * 0.04,
          left: 10,
        }}
        zoomEnabled={true}
        scaleBarEnabled={false}
        scrollEnabled={true}
        // TODO We need to create sat/topo map in mapbox studio like in WAT app to do a switcher... Using WAT default for now
        styleURL={mapStyle.URL}
      >
        <Camera
          followUserLocation={followUser}
          ref={cameraRef}
          defaultSettings={CONFIG.MAP.DEFAULT_SETTINGS.SHEOAK}
          minZoomLevel={11.5}
          maxZoomLevel={18}
        />
        <UserLocation
          androidRenderMode="normal"
          renderMode={UserLocationRenderMode.Native}
          showsUserHeadingIndicator={true}
          animated={true}
          requestsAlwaysUse={true}
          visible={true}
          onUpdate={(location) => {
            if (recordingState.isRecording) {
              updateLocation(location.coords);
            }
          }}
          minDisplacement={0}
        />
        <CurrentShapeSource />
      </Mapbox.MapView>
      {/* Embedding here may cause too many components to re-render */}
      <FocusCurrentPosition />
      <MapStyleButton />
      <StatOverlay />
      <Recording />
    </>
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
