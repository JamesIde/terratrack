import { createDrawerNavigator } from "@react-navigation/drawer";
import { globalColors } from "../global/styles/globalColors";
import { Image, StyleSheet, Pressable } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import AccountScreen from "../screens/AccountScreen";
import HomeScreen from "../screens/HomeScreen";
const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const navigation = useNavigation();
  const { isLoaded, isSignedIn, user } = useUser();
  console.log(user?.imageUrl);
  return (
    <Drawer.Navigator
      initialRouteName="Terratrack"
      screenOptions={{
        headerStyle: {
          backgroundColor: globalColors.primaryLightBlue,
        },
        headerRight: ({ tintColor }) =>
          ({ isSignedIn } && (
            <Pressable
              onPress={() => {
                navigation.navigate("Account" as never);
              }}
            >
              <Image style={styles.tinyLogo} source={{ uri: user?.imageUrl }} />
            </Pressable>
          )),
      }}
    >
      <Drawer.Screen name="Terratrack" component={HomeScreen} />
      <Drawer.Screen name="Account" component={AccountScreen} />
      <Drawer.Screen
        name="SignIn"
        component={SignInScreen}
        options={{
          drawerItemStyle: { height: 0 },
        }}
      />
      <Drawer.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          drawerItemStyle: { height: 0 },
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  tinyLogo: {
    width: 45,
    height: 45,
    marginRight: 15,
    borderRadius: 50,
  },
});
