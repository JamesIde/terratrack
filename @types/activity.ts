import { activityTypeEnum } from "./enum/activityTypeEnum";
import { Position } from "@rnmapbox/maps/lib/typescript/types/Position";

export interface Activity {
  type: typeof activityTypeEnum;
  duration?: number;
  startTime?: Date;
  endTime?: Date;
  distance?: number;
  coordinates?: Position[];
}
