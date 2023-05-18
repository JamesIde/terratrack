import { View, Text } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useMemo, useCallback } from "react";
import { styles } from "../mapbox/Map";
import { Dimensions } from "react-native";
export default function Activity() {
  const data = useMemo(
    () =>
      Array(50)
        .fill(0)
        .map((_, index) => `index-${index}`),
    []
  );
  const snapPoints = useMemo(() => ["5%", "50%"], []);
  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.itemContainer}>
        <Text>blah</Text>
      </View>
    ),
    []
  );
  return (
    <BottomSheet snapPoints={snapPoints}>
      <BottomSheetFlatList
        data={data}
        keyExtractor={(i) => i}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainer}
        style={{
          marginBottom: Dimensions.get("window").height * 0.01,
          marginTop: Dimensions.get("window").height * 0.04,
        }}
      />
    </BottomSheet>
  );
}
