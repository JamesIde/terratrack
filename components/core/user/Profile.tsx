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
      console.log(res.activityTypeCount, res.totalDistance);
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
            {/* <Loading marginTop="0" showText={false} /> */}
            <Text>Favourite: Hiking</Text>
            <Text>Total Distance: 100km</Text>
          </View>
        </View>
        <View>
          <View
            style={{
              marginLeft: 15,
            }}
          >
            <Text style={[globalStyles.boldHeader, ,]}>Your Activites</Text>
            <Text>Activities synced to the cloud from your device.</Text>
          </View>
        </View>
        <View
          style={{
            margin: 10,
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
      </View>
      <DeleteActivityModal
        modalVisible={modalVisible}
        closeModal={async (showModal) => {
          if (showModal) {
            await deleteActivity(delId).then((res) => {
              if (res.status === 204) {
                fetch();
              } else {
                console.log(res);
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
    marginTop: "5%",
    marginLeft: "5%",
  },
});
