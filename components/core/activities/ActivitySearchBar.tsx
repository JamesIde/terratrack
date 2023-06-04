import { View, StyleSheet, TextInput } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import { globalColors } from "../../../global/styles/globalColors";
import { searchStore } from "../../../stores/searchStore";
export default function ActivitySearchBar() {
  const setSearch = searchStore((state) => state.setSearch);
  return (
    <View style={styles.container}>
      <EvilIcons name="search" size={24} color="black" style={styles.icon} />
      <TextInput
        placeholder="Search routes"
        onChangeText={(text) => setSearch(text)}
        keyboardType="default"
        style={{
          width: "100%",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: globalColors.primaryWhite,
    padding: 2,
    borderRadius: 7,
    marginBottom: 25,
  },
  icon: {
    marginTop: 1,
  },
});
