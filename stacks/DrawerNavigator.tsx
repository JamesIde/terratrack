import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "../screens/Home";
import Account from "../screens/Account";
import { globalColors } from "../global/styles/globalColors";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, View, Pressable } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
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
      <Drawer.Screen name="Terratrack" component={Home} />
      <Drawer.Screen name="Account" component={Account} />
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
