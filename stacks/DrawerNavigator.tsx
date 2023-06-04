import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import Home from "../screens/Home";
import Account from "../screens/Account";
const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Account" component={Account} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
