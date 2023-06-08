import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useEffect } from "react";
import { useClerk } from "@clerk/clerk-expo";

export default function Profile() {
  const { user } = useUser();
  const { signOut } = useAuth();
  useEffect(() => {
    console.log(JSON.stringify(user));
  });

  return (
    <View>
      <Text>Profile</Text>
      <Button onPress={() => signOut()} mode="contained">
        Sign Out
      </Button>
    </View>
  );
}
