import { Position } from "@rnmapbox/maps/lib/typescript/types/Position";

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
}

interface ActivityMetadata {
  color: string;
}

export interface PreActivity {
  description: string | undefined;
  activityType: string | undefined;
}
