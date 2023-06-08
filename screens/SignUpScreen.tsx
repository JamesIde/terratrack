import { StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useSignUp, useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import ValidationError from "../components/core/common/ValidationError";
import { getException } from "../services/exception.service";
import { UserData } from "../@types/signup";
import { globalStyles } from "../global/styles/globalStyles";
import { ShowAlert } from "../utils/alert/alert";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../@types/navigation";
export default function SignUpScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}) {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Sign Up",
    });
  }, []);

  const { user, isSignedIn } = useUser();
  const [flatTextSecureEntry, setFlatTextSecureEntry] = useState(true);
  const { isLoaded, signUp, setActive } = useSignUp();
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const {
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      emailAddress: "",
      password: "",
      confirmPassword: "",
    },
  });

  // start the sign up process.
  const onSignUpPress = async (data: UserData) => {
    setSignUpLoading(true);
    if (!isLoaded) {
      return;
    }
    try {
      await signUp.create({
        firstName: data.firstName,
        lastName: data.lastName,
        emailAddress: data.emailAddress,
        password: data.password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // change the UI to our pending section.
      setPendingVerification(true);
    } catch (err: any) {
      getException(err);
      console.error(JSON.stringify(err, null, 2));
    }
    setSignUpLoading(false);
  };

  // This verifies the user using email code that is delivered.
  const onPressVerify = async () => {
    setVerifyLoading(true);
    if (!isLoaded) {
      return;
    }

    try {
      await signUp
        .attemptEmailAddressVerification({
          code,
        })
        .then(async (res) => {
          console.log(res);
          await setActive({ session: res.createdSessionId }).then(() => {
            navigation.navigate("Terratrack");
            setPendingVerification(false);
            reset();
          });
        });
    } catch (err: any) {
      getException(err);
      console.error(JSON.stringify(err, null, 2));
    }
    setVerifyLoading(false);
  };
  return (
    <>
      {/* {isSignedIn && <Text>{user.emailAddresses[0].emailAddress}</Text>} */}
      <View style={styles.container}>
        {!pendingVerification && (
          <>
            <Text style={globalStyles.boldHeader}>Sign Up</Text>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Text>Joined us before? </Text>
              <Text
                onPress={() => navigation.navigate("SignIn")}
                style={{
                  color: "#0000FF",
                  fontWeight: "bold",
                }}
              >
                Login
              </Text>
            </View>
            <View>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.formField}>
                    <TextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="First Name"
                      placeholderTextColor="#000"
                    />
                    {errors.firstName?.type === "required" && (
                      <ValidationError text="Name is required" color="red" />
                    )}
                  </View>
                )}
                name="firstName"
              />
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.formField}>
                    <TextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Last Name"
                      placeholderTextColor="#000"
                    />
                    {errors.lastName?.type === "required" && (
                      <ValidationError text="Name is required" color="red" />
                    )}
                  </View>
                )}
                name="lastName"
              />
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
                      placeholderTextColor="#000"
                      placeholder="Email"
                    />
                    {errors.emailAddress?.type === "required" && (
                      <ValidationError
                        text="An email is required"
                        color="red"
                      />
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
                          onPress={() =>
                            setFlatTextSecureEntry(!flatTextSecureEntry)
                          }
                          forceTextInputFocus={false}
                        />
                      }
                    />
                    {errors.password?.type === "minLength" && (
                      <ValidationError
                        text="Password must be minimum 8 characters"
                        color="red"
                      />
                    )}
                    {errors.emailAddress?.type === "required" && (
                      <ValidationError
                        text="A password is required"
                        color="red"
                      />
                    )}
                  </View>
                )}
                name="password"
              />
              <Controller
                control={control}
                rules={{
                  required: true,
                  validate: (value) => value === getValues("password"),
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.formField}>
                    <TextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Confirm Password"
                      secureTextEntry={flatTextSecureEntry}
                      placeholderTextColor="#000"
                      right={
                        <TextInput.Icon
                          icon={flatTextSecureEntry ? "eye" : "eye-off"}
                          onPress={() =>
                            setFlatTextSecureEntry(!flatTextSecureEntry)
                          }
                          forceTextInputFocus={false}
                        />
                      }
                    />
                    {errors.confirmPassword?.type === "validate" && (
                      <ValidationError
                        text="Passwords do not match"
                        color="red"
                      />
                    )}
                  </View>
                )}
                name="confirmPassword"
              />
              {/* <ProgressBar indeterminate visible={showLoading} /> */}
              <Button
                onPress={handleSubmit(onSignUpPress)}
                mode="contained"
                loading={signUpLoading}
                style={{
                  width: "50%",
                  alignSelf: "flex-end",
                  marginTop: 10,
                  marginBottom: 20,
                }}
              >
                <Text>Sign up</Text>
              </Button>
            </View>
          </>
        )}
        {pendingVerification && (
          <>
            <Text style={globalStyles.boldHeader}>Email Verify</Text>
            <Text>Please check your email for a verification code</Text>
            <View style={styles.formField}>
              <TextInput
                value={code}
                placeholder="Code..."
                onChangeText={(code) => setCode(code)}
              />
            </View>
            <View
              style={{
                marginTop: 10,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Button
                onPress={async () => {
                  await signUp!
                    .prepareEmailAddressVerification({
                      strategy: "email_code",
                    })
                    .then(() => {
                      ShowAlert(
                        "Email Sent",
                        "Please check your email for a verification code",
                        [
                          {
                            text: "OK",
                          },
                        ]
                      );
                    });
                }}
                mode="outlined"
              >
                Resend Code
              </Button>

              <Button
                onPress={onPressVerify}
                loading={verifyLoading}
                mode="contained"
                style={{
                  width: "50%",
                  alignSelf: "flex-end",
                }}
              >
                <Text>Verify Email</Text>
              </Button>
            </View>
            <View>
              <Text
                style={{
                  textAlign: "right",
                  marginTop: 10,
                  color: "#0000FF",
                  fontWeight: "bold",
                }}
                onPress={() => setPendingVerification(false)}
              >
                Go Back
              </Text>
            </View>
          </>
        )}
      </View>
    </>
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
