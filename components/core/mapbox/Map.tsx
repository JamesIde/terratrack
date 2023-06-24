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
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";

import SelectedShapeSource from "./SelectedShapeSource";
import Recording from "../../buttons/Recording";
import FocusCurrentPosition from "../../buttons/FocusCurrentPosition";
import MapStyleButton from "../../buttons/MapStyle";
import CurrentShapeSource from "./CurrentShapeSource";
import { ExpoLocation } from "../../../@types/expoLocation";
import { transformCoord } from "../../../utils/transformers/processCoord";
import { printCurrentTime } from "../../../utils/printTime";
import SelectedElevationMarker from "./SelectedElevationMarker";
import { useNavigation } from "@react-navigation/native";
/**
 * The coordinates for point annotation follow [longitude, latitude]. Longitude is the bigger number (138), latitude is the smaller number (-35).
 */
Mapbox.setAccessToken(CONFIG.MAP.ACCESS_TOKEN);

const TASK_FETCH_LOCATION = "TASK_FETCH_LOCATION";

export default function Map() {
  const navigation = useNavigation();
  // This allows the camera to move back to user location after selected activity deselection
  const cameraRef = useRef<CameraRef>(null);
  const mapStyle = mapStore((state) => state.mapStyle);
  const [
    recordingState,
    locations,
    updateDistance,
    updateElevation,
    updateLocation,
  ] = recordingStore((state) => [
    state.recordingState,
    state.locations,
    state.updateDistance,
    state.updateElevation,
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
        cameraRef.current?.fitBounds(
          [location.coords.longitude, location.coords.latitude],
          [location.coords.longitude, location.coords.latitude],
          100,
          500
        );
      });
    }
  };

  TaskManager.defineTask(TASK_FETCH_LOCATION, ({ data, error }) => {
    if (error) {
      // check `error.message` for more details.
      return;
    }

    if (recordingState.isRecording) {
      let location = data as ExpoLocation;
      // location.locations.forEach((location) => {
      updateLocation(location.locations[0].coords);
      if (locations.length === 2) {
        // get first two coords in the arr
        let coords = transformCoord(locations[0], locations[1]);
        updateDistance(coords.a, coords.b);
      } else if (locations.length > 2) {
        // get the last known coord plus latest coord from location update
        let coords = transformCoord(
          locations[locations.length - 2],
          locations[locations.length - 1]
        );
        updateDistance(coords.a, coords.b);
        updateElevation(locations[locations.length - 1].altitude!);
      }
    }
  });

  useEffect(() => {
    zoomToActivity();
    if (recordingState.isRecording) {
      Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 0,
        foregroundService: {
          notificationTitle: "Using your location",
          notificationBody:
            "Tracking your location to provide the best experience possible.",
          notificationColor: "#ff0000",
        },
        showsBackgroundLocationIndicator: true,
        timeInterval: 1000,
      });
    }

    return () => {
      Location.stopLocationUpdatesAsync(TASK_FETCH_LOCATION).catch(() => {});
    };
    // Cleanup the interval when the component unmounts
  }, [selectedActivity, recordingState]);

  const getCoords = async () => {
    return await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
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
          // minZoomLevel={11.5}
          maxZoomLevel={15}
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
        <SelectedElevationMarker />
      </Mapbox.MapView>
      <>
        {!selectedActivity && (
          <>
            <FocusCurrentPosition />
            <MapStyleButton />
            {/* <StatOverlay /> */}
            <Recording navigation={navigation as any} />
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
