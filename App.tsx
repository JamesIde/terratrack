import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import { CONFIG } from "./config/config";
import { NavigationContainer } from "@react-navigation/native";
import { ClerkProvider } from "@clerk/clerk-expo";
import DrawerNavigator from "./stacks/DrawerNavigator";
import * as Sentry from "@sentry/react-native";
Sentry.init({
  dsn: CONFIG.SENTRY.DSN,
});
function App() {
  const CLERK_PUBLISHABLE_KEY = CONFIG.CLERK.PUBLISHABLE_KEY;

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
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
