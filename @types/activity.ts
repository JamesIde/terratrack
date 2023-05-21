import { Position } from "@rnmapbox/maps/lib/typescript/types/Position";
export interface PreActivity {
  description: string | undefined;
  activityType: string | undefined;
}

export interface Activity {
  description: string;
  type: string;
  duration: string;
  startTime: string;
  endTime: string;
  distance: number;
  coordinates: Position[];
  id: string;
  metadata: ActivityMetadata;
  elevation?: elevationMetadata;
}

export interface elevationMetadata {
  maxElevation: number;
  minElevation: number;
  elevationGain: number;
  elevationPoints: number[];
}

interface ActivityMetadata {
  color: string;
}
