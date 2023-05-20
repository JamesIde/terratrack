import { Alert, AlertButton } from "react-native";

export function ShowAlert(
  title: string,
  message: string,
  buttons: AlertButton[],
  options?: {
    cancelable?: boolean | undefined;
    onDismiss?: (() => void) | undefined;
  }
) {
  Alert.alert(title, message, buttons, options);
}
