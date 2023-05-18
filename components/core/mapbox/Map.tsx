import { Button, Dimensions, StyleSheet, View } from "react-native";
import React, { useEffect, useRef } from "react";
import Mapbox, {
  Camera,
  MapView,
  PointAnnotation,
  UserLocation,
  UserLocationRenderMode,
} from "@rnmapbox/maps";
import { CONFIG } from "../../../config/config";
import { CameraRef } from "@rnmapbox/maps/lib/typescript/components/Camera";
import { mapStore } from "../../../stores/mapStore";
import StatOverlay from "../overlay/statOverlay";
import MapStyleButton from "../../buttons/mapStyle";
import FocusCurrentPosition from "../../buttons/focusCurrentPosition";
import { trackingStore } from "../../../stores/trackingStore";
import Recording from "../../buttons/recording";
Mapbox.setAccessToken(CONFIG.MAP.ACCESS_TOKEN);
Mapbox.requestAndroidLocationPermissions();
export default function Map() {
  const cameraRef = useRef<CameraRef>(null);
  const mapRef = useRef<MapView>(null);
  const [mapStyle, toggleMapStyle] = mapStore((state) => [
    state.mapStyle,
    state.toggleMapStyle,
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
          onUpdate={(location) =>
            console.log(`${JSON.stringify(location.coords)}`)
          }
          minDisplacement={0}
        />
        <PointAnnotation id="test" coordinate={[138.773431, -35.052564]}>
          <View style={{ padding: 3, backgroundColor: "red" }}></View>
        </PointAnnotation>
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
