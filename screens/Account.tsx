import * as React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
import { useSignUp, useUser } from "@clerk/clerk-expo";
import SignUp from "../components/core/user/SignUp";
import { NativeStackNavigationProp } from "@react-navigation/native-stack/lib/typescript/src/types";
import { RootStackParamList } from "../@types/navigation";
import { useState } from "react";
import SignIn from "../components/core/user/SignIn";
import Profile from "../components/core/user/Profile";

export default function Account({
  navigation,
}: {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}) {
  const { isLoaded, isSignedIn, user } = useUser();
  const [displaySignIn, setDisplaySignIn] = useState(false);

  function togglePage() {
    setDisplaySignIn(!displaySignIn);
  }

  return (
    <>
      {isSignedIn ? (
        <Profile />
      ) : displaySignIn ? (
        <SignIn togglePage={togglePage} />
      ) : (
        <SignUp togglePage={togglePage} />
      )}
    </>
  );
}
