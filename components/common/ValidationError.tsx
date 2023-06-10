import { Text } from "react-native";
export default function ValidationError({
  text,
  color,
}: {
  text: string;
  color: string;
}) {
  return (
    <>
      <Text style={{ color: color }}>{text}</Text>
    </>
  );
}
