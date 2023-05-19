import { Dimensions, StyleSheet } from "react-native";
import React, { useRef } from "react";
import Mapbox, {
  Camera,
  MapView,
  UserLocation,
  UserLocationRenderMode,
} from "@rnmapbox/maps";
import { CONFIG } from "../../../config/config";
import { CameraRef } from "@rnmapbox/maps/lib/typescript/components/Camera";
import { mapStore } from "../../../stores/mapStore";
import { trackingStore } from "../../../stores/trackingStore";
import { recordingStore } from "../../../stores/recordingStore";
import Recording from "../../buttons/Recording";
import StatOverlay from "../overlay/statOverlay";
import FocusCurrentPosition from "../../buttons/FocusCurrentPosition";
import MapStyleButton from "../../buttons/MapStyle";
import CurrentShapeSource from "./CurrentShapeSource";
import { transformCoord } from "../../../utils/processCoord";
/**
 * We don't want to manipulate the mapbox location object if we can avoid it.
 * If we do, have a util method that does that. Don't want to lose track over the app
 * Where coordinates are of different types when they all should be the same.
 * Use utils heavily for data transforming.
 * The coordinates for point annotation follow [longitude, latitude]. Longitude is the bigger number (138), latitude is the smaller number (-35).
 */
Mapbox.setAccessToken(CONFIG.MAP.ACCESS_TOKEN);
Mapbox.requestAndroidLocationPermissions();
export default function Map() {
  const cameraRef = useRef<CameraRef>(null);
  const mapRef = useRef<MapView>(null);
  const mapStyle = mapStore((state) => state.mapStyle);
  const [recordingState, locations, updateLocation, updateDistance] =
    recordingStore((state) => [
      state.recordingState,
      state.locations,
      state.updateLocation,
      state.updateDistance,
    ]);
  const followUser = trackingStore((state) => state.followUser);
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
        // TODO own sat/topo URLS. not WAT
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
            console.log(`loc up`);
            if (recordingState.isRecording) {
              updateLocation(location.coords);
              if (locations.length === 2) {
                let coords = transformCoord(locations[0], locations[1]);
                updateDistance(coords.a, coords.b);
              } else {
                let coords = transformCoord(locations[locations.length - 1], {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                });
                updateDistance(coords.a, coords.b);
              }
            }
          }}
          minDisplacement={0}
        />
        <CurrentShapeSource />
      </Mapbox.MapView>
      {/* TODO Embedding here may cause too many components to re-render */}
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
