import { Position } from "@rnmapbox/maps/lib/typescript/types/Position";
export interface PreActivity {
  description: string | undefined;
  activity: string | undefined;
}

export interface Activity {
  description: string;
  type: string;
  duration: number;
  startTime: Date;
  endTime: Date;
  distance: number;
  coordinates: Position[];
  id: string;
  userId?: string;
  metadata: ActivityMetadata;
  elevation: ElevationMetadata;
}

export interface ElevationMetadata {
  maxElevation: number;
  minElevation: number;
  elevationGain: number;
  elevationPoints: number[];
}

export interface ActivityMetadata {
  color: string;
}
