import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { globalColors } from "../../global/styles/globalColors";
import { Picker } from "@react-native-picker/picker";
import { useRef, useState } from "react";
import { sortTypes } from "../../constants/sorts";
import { sortStore } from "../../stores/sortStore";

export default function ActivitySortButton() {
  const [selectedSort, setSelectedSort] = sortStore((state) => [
    state.selectedSort,
    state.setSelectedSort,
  ]);
  return (
    <>
      <View>
        <Picker
          onValueChange={(itemValue) => setSelectedSort(itemValue)}
          style={{ height: 50, width: 150 }}
          selectedValue={selectedSort}
          dropdownIconColor={globalColors.primaryGreen}
        >
          {sortTypes.map((type) => {
            return (
              <Picker.Item
                label={type.label}
                value={type.value}
                key={type.label}
              />
            );
          })}
        </Picker>
      </View>
    </>
  );
}
