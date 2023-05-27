import { CameraStop } from "@rnmapbox/maps/lib/typescript/components/Camera";
import Constants from "expo-constants";
export const CONFIG = {
  MAP: {
    ACCESS_TOKEN: Constants.expoConfig?.extra?.MAPBOX_ACCESS_TOKEN,
    TOPOGRAPHIC: {
      URL: Constants.expoConfig?.extra?.TOPOGRAPHIC_URL,
      TYPE: "topo",
    },
    SATELLITE: {
      URL: Constants.expoConfig?.extra?.SATELLITE_URL,
      TYPE: "satellite",
    },
    DEFAULT_SETTINGS: {
      SHEOAK: <CameraStop>{
        zoomLevel: 15,
        centerCoordinate: [138.778641, -35.054471],
        animationMode: "none",
      },
    },
  },
  SENTRY: {
    DSN: Constants.expoConfig?.extra?.SENTRY_DSN,
  },
};
