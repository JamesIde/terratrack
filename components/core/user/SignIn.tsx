import { useSignIn } from "@clerk/clerk-expo";
import { Controller, useForm } from "react-hook-form";
import { View, Text, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { globalStyles } from "../../../global/styles/globalStyles";
import ValidationError from "../common/ValidationError";
import { useState } from "react";
import { UserData } from "../../../@types/signup";
import { getException } from "../../../services/exception.service";
import { useNavigation } from "@react-navigation/native";
export default function SignIn({ togglePage }: { togglePage: () => void }) {
  const navigation = useNavigation();
  const [flatTextSecureEntry, setFlatTextSecureEntry] = useState(true);
  const [signInLoading, setSignInLoading] = useState(false);
  const { signIn, setActive, isLoaded } = useSignIn();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      emailAddress: "",
      password: "",
    },
  });

  const onSignInPress = async (data: UserData) => {
    setSignInLoading(true);
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: data.emailAddress,
        password: data.password,
      });
      await setActive({ session: completeSignIn.createdSessionId }).then(() => {
        navigation.navigate("Terratrack" as never);
      });
    } catch (err: any) {
      getException(err);
      console.error(JSON.stringify(err, null, 2));
    }
    setSignInLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={globalStyles.boldHeader}>Sign In</Text>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Text>New to Terratrack? </Text>
        <Text
          onPress={togglePage}
          style={{
            color: "#0000FF",
            fontWeight: "bold",
          }}
        >
          Register
        </Text>
      </View>
      <View>
        <Controller
          control={control}
          rules={{
            required: true,
            validate: (value) => value.includes("@"),
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.formField}>
              <TextInput
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Email"
              />
              {errors.emailAddress?.type === "required" && (
                <ValidationError text="An email is required" color="red" />
              )}
              {errors.emailAddress?.type === "validate" && (
                <ValidationError text="Email must be valid" color="red" />
              )}
            </View>
          )}
          name="emailAddress"
        />
        <Controller
          control={control}
          rules={{
            required: true,
            minLength: 8,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.formField}>
              <TextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Password"
                secureTextEntry={flatTextSecureEntry}
                placeholderTextColor="#000"
                right={
                  <TextInput.Icon
                    icon={flatTextSecureEntry ? "eye" : "eye-off"}
                    onPress={() => setFlatTextSecureEntry(!flatTextSecureEntry)}
                    forceTextInputFocus={false}
                  />
                }
              />
              {errors.emailAddress?.type === "required" && (
                <ValidationError text="A password is required" color="red" />
              )}
            </View>
          )}
          name="password"
        />
        <Button
          onPress={handleSubmit(onSignInPress)}
          mode="contained"
          loading={signInLoading}
          style={{
            width: "50%",
            alignSelf: "flex-end",
            marginTop: 10,
            marginBottom: 20,
          }}
        >
          <Text>Sign In</Text>
        </Button>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    marginTop: "10%",
    marginLeft: "5%",
    marginRight: "5%",
  },
  formField: {
    marginTop: "2%",
    marginBottom: "5%",
  },
});
