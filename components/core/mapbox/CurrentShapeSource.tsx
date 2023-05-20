import { LineLayer, ShapeSource } from "@rnmapbox/maps";
import { useEffect } from "react";
import { lineStyle } from "../../../global/styles/globalLineStyles";
import { recordingStore } from "../../../stores/recordingStore";
import { processCoordinates } from "../../../utils/transformers/processCoordinates";
export default function CurrentShapeSource() {
  const [locations, showLine, setShowLine] = recordingStore((state) => [
    state.locations,
    state.showLine,
    state.setShowLine,
  ]);

  useEffect(() => {
    if (locations.length > 1) {
      setShowLine(true);
    }
  }, [locations]);
  return (
    <>
      {showLine && (
        <ShapeSource
          id="source1"
          lineMetrics={true}
          shape={{
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: processCoordinates(locations),
            },
            properties: {},
          }}
        >
          <LineLayer id="layer1" style={lineStyle.lineLayer} />
        </ShapeSource>
      )}
    </>
  );
}
