import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { Activity } from "../../@types/activity";
import { globalColors } from "../../global/styles/globalColors";
import { useEffect, useLayoutEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useUser } from "@clerk/clerk-expo";
import { upload, exists } from "../../services/supabase.service";
import { ShowAlert } from "../../utils/alert/alert";
export default function UploadActivityButton({
  activity,
}: {
  activity: Activity;
}) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const [isUploaded, setIsUploaded] = useState(false);

  useEffect(() => {
    if (activity) {
      doesExist();
    }
  }, [activity]);

  async function doesExist() {
    await exists(user!.id, activity!.id).then((res) => {
      setIsUploaded(res);
    });
  }

  async function handleActivityUpload() {
    setLoading(true);
    try {
      let newUpload = await upload(activity, user!.id);
      if (newUpload.error) {
        ShowAlert("Error", "An error occured uploading your activity.", [
          {
            text: "Ok",
          },
        ]);
        console.error(newUpload.error.message);
      } else if (newUpload.status === 201) {
        setIsUploaded(true);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  return (
    <>
      {isUploaded ? (
        <Button
          mode="text"
          icon={"check"}
          textColor={globalColors.primaryGreen}
        >
          Uploaded
        </Button>
      ) : (
        <Button
          mode="text"
          loading={loading}
          onPress={handleActivityUpload}
          icon="upload"
          textColor={globalColors.primaryGreen}
        >
          Upload
        </Button>
      )}
    </>
  );
}
