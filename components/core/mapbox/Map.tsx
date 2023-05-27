import { Dimensions, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";
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
import { activityStore } from "../../../stores/activityStore";
import { Position } from "@rnmapbox/maps/lib/typescript/types/Position";
import * as Turf from "@turf/turf";
import {
  LocationObject,
  Accuracy,
  getCurrentPositionAsync,
} from "expo-location";

import SelectedShapeSource from "./SelectedShapeSource";
import Recording from "../../buttons/Recording";
import FocusCurrentPosition from "../../buttons/FocusCurrentPosition";
import MapStyleButton from "../../buttons/MapStyle";
import CurrentShapeSource from "./CurrentShapeSource";
/**
 * The coordinates for point annotation follow [longitude, latitude]. Longitude is the bigger number (138), latitude is the smaller number (-35).
 */
Mapbox.setAccessToken(CONFIG.MAP.ACCESS_TOKEN);
export default function Map() {
  // This allows the camera to move back to user location after selected activity deselection
  const [userLocation, setUserLocation] = useState<LocationObject | null>(null);
  const cameraRef = useRef<CameraRef>(null);
  const mapRef = useRef<MapView>(null);
  const mapStyle = mapStore((state) => state.mapStyle);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [recordingState, updateLocation] = recordingStore((state) => [
    state.recordingState,
    state.updateLocation,
  ]);
  const [followUser, setFollowUser] = trackingStore((state) => [
    state.followUser,
    state.setFollowUser,
  ]);
  const selectedActivity = activityStore((state) => state.selectedActivity);

  const zoomToActivity = async () => {
    let screenHeight = Dimensions.get("window").height;
    let ne: Position = [0, 0];
    let sw: Position = [0, 0];
    if (selectedActivity) {
      let coords = Turf.lineString(selectedActivity.coordinates);
      let bbox = Turf.bbox(coords);
      ne = [bbox[2], bbox[3]];
      sw = [bbox[0], bbox[1]];
      cameraRef.current?.fitBounds(
        ne,
        sw,
        [screenHeight * 0.1, 0, screenHeight * 0.6, 0],
        100
      );
    } else {
      setFollowUser(false);
      await getCoords().then((location) => {
        setTimeout(() => {
          cameraRef.current?.fitBounds(
            [location.coords.longitude, location.coords.latitude],
            [location.coords.longitude, location.coords.latitude],
            100,
            500
          );
        }, 100);
      });
    }
  };

  useEffect(() => {
    console.log(!!selectedActivity);
    zoomToActivity();

    if (recordingState.isRecording) {
      const interval = setInterval(async () => {
        let location = await getCoords();
        updateLocation(location.coords);
      }, 3000);
      setIntervalId(interval);
    }

    if (recordingState.isStopped && intervalId) {
      clearInterval(intervalId);
    }

    // Cleanup the interval when the component unmounts
  }, [selectedActivity, recordingState]);

  const getCoords = async () => {
    return await getCurrentPositionAsync({
      accuracy: Accuracy.BestForNavigation,
    });
  };

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
        />
        <CurrentShapeSource />
        <SelectedShapeSource />
      </Mapbox.MapView>
      <>
        {!selectedActivity && (
          <>
            <FocusCurrentPosition />
            <MapStyleButton />
            {/* <StatOverlay /> */}
            <Recording />
          </>
        )}
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
