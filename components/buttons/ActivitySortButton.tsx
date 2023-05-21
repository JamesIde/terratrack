import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { globalColors } from "../../global/styles/globalColors";
export default function ActivitySortButton() {
  return (
    <View style={{ alignItems: "flex-end", paddingRight: 15, marginTop: 20 }}>
      <FontAwesome
        name="exchange"
        size={20}
        color={globalColors.primaryGreen}
        style={{
          transform: [{ rotate: "90deg" }],
        }}
      />
    </View>
  );
}
