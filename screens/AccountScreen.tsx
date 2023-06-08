import { useSignUp, useUser } from "@clerk/clerk-expo";
import { NativeStackNavigationProp } from "@react-navigation/native-stack/lib/typescript/src/types";
import { RootStackParamList } from "../@types/navigation";
import { useLayoutEffect } from "react";
import Profile from "../components/core/user/Profile";
import { View, Text } from "react-native";

export default function AccountScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}) {
  const { isSignedIn } = useUser();

  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      if (!isSignedIn) {
        navigation.navigate("SignIn");
      }
    });

    return unsubscribe;
  }, [isSignedIn]);

  return (
    <>
      {isSignedIn && (
        <View>
          <Profile navigation={navigation} />
        </View>
      )}
    </>
  );
}
