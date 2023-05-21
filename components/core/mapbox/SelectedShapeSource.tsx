import { LineLayer, ShapeSource } from "@rnmapbox/maps";
import { activityStore } from "../../../stores/activityStore";
export default function SelectedShapeSource() {
  const selectedActivity = activityStore((state) => state.selectedActivity);
  return (
    <>
      {selectedActivity && (
        <ShapeSource
          id="source1"
          lineMetrics={true}
          shape={{
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: selectedActivity.coordinates,
            },
            properties: {},
          }}
        >
          <LineLayer
            id="layer1"
            style={{
              lineColor: selectedActivity.metadata.color,
              lineJoin: "round",
              lineCap: "round",
              lineWidth: 3,
            }}
          />
        </ShapeSource>
      )}
    </>
  );
}
