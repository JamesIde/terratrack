import { activityTypeEnum } from "./activityTypeEnum";
import { Position } from "@rnmapbox/maps/lib/typescript/types/Position";

export interface Activity {
  type: typeof activityTypeEnum;
  duration: number;
  startDate: Date;
  endDate: Date;
  distance: number;
  coordinates: Position[];
}
