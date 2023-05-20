import { activityTypeEnum } from "./enum/activityTypeEnum";
import { Position } from "@rnmapbox/maps/lib/typescript/types/Position";

export interface Activity {
  description: string;
  type: string;
  duration: string;
  startTime: string;
  endTime: string;
  distance: number;
  coordinates: Position[];
}
