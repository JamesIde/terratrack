import { View, Text, ActivityIndicator } from "react-native";
export default function Loading({
  marginTop,
  showText,
}: {
  marginTop: string;
  showText?: boolean;
}) {
  return (
    <View style={{ marginTop: `${marginTop}%` }}>
      {showText && <Text style={{ textAlign: "center" }}>Loading..</Text>}
      <ActivityIndicator color="red" size="large" />
    </View>
  );
}
