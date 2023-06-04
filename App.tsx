import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { CONFIG } from "./config/config";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import * as Sentry from "@sentry/react-native";
import Account from "./screens/Account";
import Home from "./screens/Home";
Sentry.init({
  dsn: CONFIG.SENTRY.DSN,
});
function App() {
  const Drawer = createDrawerNavigator();

  return (
    <>
      <PaperProvider>
        <SafeAreaView style={{ height: "100%" }}>
          <StatusBar style="auto" />
          <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home">
              <Drawer.Screen name="Home" component={Home} />
              <Drawer.Screen name="Account" component={Account} />
            </Drawer.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </PaperProvider>
    </>
  );
}
export default Sentry.wrap(App);
