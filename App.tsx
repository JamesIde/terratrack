import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import { CONFIG } from "./config/config";
import { NavigationContainer } from "@react-navigation/native";
import { ClerkProvider } from "@clerk/clerk-expo";
import DrawerNavigator from "./stacks/DrawerNavigator";
import * as Sentry from "@sentry/react-native";
import * as SecureStore from "expo-secure-store";
Sentry.init({
  dsn: CONFIG.SENTRY.DSN,
});
function App() {
  const CLERK_PUBLISHABLE_KEY = CONFIG.CLERK.PUBLISHABLE_KEY;

  const tokenCache = {
    async getToken(key: string) {
      try {
        return SecureStore.getItemAsync(key);
      } catch (err) {
        return null;
      }
    },
    async saveToken(key: string, value: string) {
      try {
        return SecureStore.setItemAsync(key, value);
      } catch (err) {
        return;
      }
    },
  };

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <PaperProvider>
        <StatusBar style="auto" />
        <NavigationContainer>
          <DrawerNavigator />
        </NavigationContainer>
      </PaperProvider>
    </ClerkProvider>
  );
}
export default Sentry.wrap(App);
