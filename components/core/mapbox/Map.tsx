import { Dimensions, StyleSheet } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { transformCoord } from "../../../utils/transformers/processCoord";
import { activityStore } from "../../../stores/activityStore";
import { Position } from "@rnmapbox/maps/lib/typescript/types/Position";
import * as Turf from "@turf/turf";
import SelectedShapeSource from "./SelectedShapeSource";
import Recording from "../../buttons/Recording";
import StatOverlay from "../overlay/statOverlay";
import FocusCurrentPosition from "../../buttons/FocusCurrentPosition";
import MapStyleButton from "../../buttons/MapStyle";
import CurrentShapeSource from "./CurrentShapeSource";
/**
 * The coordinates for point annotation follow [longitude, latitude]. Longitude is the bigger number (138), latitude is the smaller number (-35).
 */
Mapbox.setAccessToken(CONFIG.MAP.ACCESS_TOKEN);
export default function Map() {
  // This allows the camera to move back to user location after selected activity deselection
  const [userLocation, setUserLocation] = useState<Mapbox.Location | null>(null);
  const cameraRef = useRef<CameraRef>(null);
  const mapRef = useRef<MapView>(null);
  const mapStyle = mapStore((state) => state.mapStyle);
  const [
    recordingState,
    locations,
    updateLocation,
    updateDistance,
    updateElevation,
  ] = recordingStore((state) => [
    state.recordingState,
    state.locations,
    state.updateLocation,
    state.updateDistance,
    state.updateElevation,
  ]);
  const [followUser, setFollowUser] = trackingStore((state) => [
    state.followUser,
    state.setFollowUser
  ]);
  const selectedActivity = activityStore((state) => state.selectedActivity);

  const zoomToActivity = () => {
    let screenHeight = (Dimensions.get("window").height)
    let ne: Position = [0, 0];
    let sw: Position = [0, 0];
    if (selectedActivity) {
      let coords = Turf.lineString(selectedActivity.coordinates);
      let bbox = Turf.bbox(coords);
      ne = [bbox[2], bbox[3]];
      sw = [bbox[0], bbox[1]];
      cameraRef.current?.fitBounds(ne, sw, [
        screenHeight * 0.1,
        0,
        screenHeight * 0.6,
        0,
      ], 100);

    } else {
      setFollowUser(false)
      if (!userLocation) { return }
      setTimeout(() => {
        cameraRef.current?.fitBounds(
          [userLocation!.coords.longitude, userLocation!.coords.latitude],
          [userLocation!.coords.longitude, userLocation!.coords.latitude],
          100, 500
        )
      }, 100)
    }
  };

  console.log(`value ${followUser}`)
  useEffect(() => {
    zoomToActivity();
  }, [selectedActivity]);
  return (
    <>
      <Mapbox.MapView
        style={[styles.map, { height: "100%" }]}
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
            setUserLocation(location)
            if (recordingState.isRecording) {
              updateLocation(location.coords);
              if (locations.length === 2) {
                // get first two coords in the arr
                let coords = transformCoord(locations[0], locations[1]);
                updateDistance(coords.a, coords.b);
              } else if (locations.length > 2) {
                // get the last known coord plus latest coord from location update
                let coords = transformCoord(locations[locations.length - 1], {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                });
                updateDistance(coords.a, coords.b);
              }
              // Sometimes altitude is not available with bad gps signal
              if (location.coords.altitude) {
                updateElevation(location.coords.altitude);
              }

              if (!followUser) {
                setFollowUser(true)
              }
            }
          }}
          minDisplacement={0} // TODO this could be dynamic based on activityType.
        />
        <CurrentShapeSource />
        <SelectedShapeSource />
      </Mapbox.MapView>
      <>
        {!selectedActivity && <>
          <FocusCurrentPosition />
          <MapStyleButton />
          <StatOverlay />
          <Recording />
        </>}
      </>
    </>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
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
