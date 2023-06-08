import { useSignUp, useUser } from "@clerk/clerk-expo";
import { NativeStackNavigationProp } from "@react-navigation/native-stack/lib/typescript/src/types";
import { RootStackParamList } from "../@types/navigation";
import { useState, useEffect, useLayoutEffect } from "react";
import Profile from "../components/core/user/Profile";

export default function AccountScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}) {
  const { isLoaded, isSignedIn, user } = useUser();

  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      if (!isSignedIn) {
        navigation.navigate("SignIn");
      }
    });

    return unsubscribe;
  }, []);

  return <>{isLoaded ?? <Profile />}</>;
}
