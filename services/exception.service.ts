import { Alert } from "react-native";
import { ClerkError } from "../@types/error/clerk";

export function getException(err: any) {
  let clerkError: ClerkError = JSON.parse(JSON.stringify(err));

  if (clerkError.clerkError) {
    return Alert.alert("Error", clerkError.errors[0].longMessage, [
      {
        text: "OK",
      },
    ]);
  }
}
