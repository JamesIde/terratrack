import { View, StyleSheet, Image, Text, FlatList } from "react-native";
import { Button } from "react-native-paper";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { globalStyles } from "../../../global/styles/globalStyles";
import { processLongDate } from "../../../utils/transformers/processDate";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../@types/navigation";
import {
  deleteActivity,
  retrieveAndParse,
} from "../../../services/supabase.service";
import ActivityItem from "../activities/ActivityItem";
import { Activity } from "../../../@types/activity";
import Loading from "../../common/Loading";
import DeleteActivityModal from "../../modals/DeleteActivityModal";
import { activityStore } from "../../../stores/activityStore";
import { ShowAlert } from "../../../utils/alert/alert";
import { Linking } from "react-native";
import { CONFIG } from "../../../config/config";
export default function Profile({
  navigation,
}: {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}) {
  const [setSelectedActivity, setNavigatedFromAccount] = activityStore(
    (state) => [state.setSelectedActivity, state.setNavigatedFromAccount]
  );
  const { user } = useUser();
  const { signOut } = useAuth();
  const [data, setData] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [delId, setDelId] = useState("");
  useEffect(() => {
    fetch();
  }, []);

  function fetch() {
    setLoading(true);
    retrieveAndParse(user!.id).then((res) => {
      setData(res.activities);
      setLoading(false);
    });
  }

  const onActivityClick = (activity: Activity) => {
    setSelectedActivity(activity);
    setNavigatedFromAccount(true);
    navigation.navigate("Terratrack");
  };
  const removeActivity = (id: string = "") => {
    setDelId(id);
    setModalVisible(true);
  };

  return (
    <>
      <View
        style={{
          height: "100%",
        }}
      >
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
          <View
            style={{
              marginLeft: 15,
            }}
          >
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Text style={[globalStyles.boldHeader]}>Your Activites</Text>
              <Button
                mode="text"
                onPress={() => {
                  // TODO FIX
                  Linking.openURL(CONFIG.WEB.URL);
                }}
                style={{
                  marginLeft: 10,
                  marginTop: 5,
                }}
              >
                View Online
              </Button>
            </View>
            <Text>Activities synced to the cloud from your device</Text>
          </View>
        </View>
        <View
          style={{
            margin: 10,
            flex: 1,
            height: "100%",
          }}
        >
          {loading ? (
            <Loading marginTop="50" />
          ) : data.length > 0 ? (
            <FlatList
              data={data}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => (
                <ActivityItem
                  activity={item}
                  onActivityClick={onActivityClick}
                  onActivityLongPress={() => removeActivity(item.id)}
                />
              )}
            />
          ) : (
            <Text>No activities yet.</Text>
          )}
        </View>
        <Button
          onPress={() =>
            signOut().then(() => {
              navigation.navigate("Terratrack");
            })
          }
          mode="contained"
          style={{
            margin: 10,
            bottom: 0,
            right: 0,
            position: "absolute",
          }}
        >
          Sign Out
        </Button>
      </View>
      <DeleteActivityModal
        modalVisible={modalVisible}
        closeModal={async (showModal) => {
          if (showModal) {
            await deleteActivity(delId).then((res) => {
              if (res.status === 204) {
                fetch();
              } else {
                ShowAlert(
                  "Error",
                  "Something went wrong. Please ensure your device is connected and try again later.",
                  [
                    {
                      text: "Ok",
                    },
                  ]
                );
              }
            });
            setModalVisible(false);
          }
          setModalVisible(false);
        }}
      />
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
    marginLeft: "7%",
    marginTop: "5%",
    marginBottom: "5%",
  },
  nameContainer: {
    marginTop: "10%",
    marginLeft: "5%",
  },
});
