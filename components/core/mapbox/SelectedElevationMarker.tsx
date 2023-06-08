import { View, Text } from "react-native";
import { markerStore } from "../../../stores/markerStore";
import { PointAnnotation } from "@rnmapbox/maps";
import { FontAwesome } from "@expo/vector-icons";
export default function SelectedElevationMarker() {
  const marker = markerStore((state) => state.marker);
  console.log(marker);
  return (
    <>
      {marker && (
        <PointAnnotation
          key={marker[0].toString()}
          id={marker[0].toString()}
          coordinate={marker}
        >
          <View>
            <FontAwesome name="dot-circle-o" size={20} color="blue" />
          </View>
        </PointAnnotation>
      )}
    </>
  );
}
