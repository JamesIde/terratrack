import * as React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import SignUp from "../components/core/user/SignUp";

export default function Account() {
  return (
    <>
      <SignUp />
    </>
  );
}
