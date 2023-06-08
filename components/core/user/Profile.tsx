import { View, StyleSheet, Image, Text } from "react-native";
import { Button } from "react-native-paper";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useEffect } from "react";
import { globalStyles } from "../../../global/styles/globalStyles";
import { processLongDate } from "../../../utils/transformers/processDate";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../@types/navigation";
export default function Profile({
  navigation,
}: {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}) {
  const { user } = useUser();
  const { signOut } = useAuth();
  useEffect(() => {
    console.log(JSON.stringify(user));
  });

  return (
    <>
      <View>
        <View style={styles.profileDetails}>
          <View style={styles.avatarContainer}>
            <Image style={styles.avatar} source={{ uri: user?.imageUrl }} />
          </View>
          <View style={styles.nameContainer}>
            <Text style={[globalStyles.boldHeader]}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text>
              Registered: {processLongDate(user?.createdAt!).toLocaleString()}
            </Text>
          </View>
        </View>
        <View>
          <Button
            onPress={() => {
              signOut().then(() => {
                navigation.navigate("Terratrack");
              });
            }}
            mode="outlined"
            style={{ marginTop: 20, width: "35%", marginBottom: 10 }}
          >
            Sign Out
          </Button>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileDetails: {
    flexDirection: "row",
  },
  avatarContainer: {
    marginRight: 10,
    marginLeft: "10%",
    marginTop: "5%",
    marginBottom: "5%",
  },
  nameContainer: {
    marginTop: "10%",
    marginLeft: "5%",
  },
});
