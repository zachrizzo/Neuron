import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import React, { useState } from "react";
import InputBox from "../components/inputs/inputBox";
import MainButton from "../components/buttons/mainButton";
import { Stack, router } from "expo-router";
import { createUserEmailAndPassword } from "../firebase/auth/user";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/userSlice";
import ProceduralCheckBox from "../components/inputs/proceduralCheckBox";
import { Validator } from "../utility/validator";
import { Formatter } from "../utility/formatter";


const signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const dispatch = useDispatch();
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");


  const validateAndSubmit = () => {
    // if (Validator.email(email) !== true) {
    //   setLoading(false); // Stop loading on error
    //   Alert.alert("Missing Information", "Please enter your email.");
    //   return;
    // }
    // if (Validator.password(password) !== true) {
    //   setLoading(false); // Stop loading on error
    //   Alert.alert("Missing Information", "Please enter a password.");
    //   return;
    // }
    // if (password.length < 6) {
    //   setLoading(false); // Stop loading on error
    //   Alert.alert(
    //     "Invalid Password",
    //     "Password should be at least 6 characters long."
    //   );
    //   return;
    // }
    // if (password !== confirmPassword) {
    //   setLoading(false); // Stop loading on error
    //   Alert.alert("Password Mismatch", "Passwords do not match.");
    //   return;
    // }
    // if (Validator.name(name) !== true) {
    //   setLoading(false); // Stop loading on error
    //   Alert.alert("Missing Information", "Please enter your full name.");
    //   return;
    // }
    // if (Validator.date(dob) == true) {
    //   setLoading(false); // Stop loading on error
    //   Alert.alert(
    //     "Missing Information",
    //     "Please check your date of birth to make sure it's valid."
    //   );
    //   return;
    // }
    // if (!language) {
    //   setLoading(false); // Stop loading on error
    //   Alert.alert("Missing Information", "Please select a language.");
    //   return;
    // }

    const userInfo = {
      name,
      dob,
      email,
      language,
      phoneNumber,
      autoSpeak: true,
      cortexxCoin: 0,
      Hearts: 10,
      heartsLastRefill: new Date(),
      numberOfMessages: 20,
      subscriptionStatus: "free",
    };
    createUserEmailAndPassword(email, password, userInfo)
      .then((res) => {
        if (res.userData) {
          dispatch(setUser(res.userData));
          setLoading(false);
          router.replace("/home");
        }
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.mainContainer}
    >
      <FlatList
        data={[1]}
        style={{ width: "100%", flex: 1 }}
        contentContainerStyle={{
          alignItems: "center",

          justifyContent: "center",
        }}
        renderItem={({ item }) => {
          return (
            <View style={styles.scrollView}>
              <Stack.Screen
                options={{
                  title: "Sign Up",
                  headerBackTitle: "Login",
                }}
              />

              <InputBox
                onChangeText={(text) => {
                  setEmail(text.toLowerCase().trim());
                }}
                value={email}
                placeholder={"Email"}
                editable={true}
                height={60}
                borderRadius={15}
                margin={20}
                validate={(value) => ({
                  isValid: Validator.email(value),
                  message: 'This field must be a valid email address.',
                })}
                label={"Email"}
              />
              <InputBox
                onChangeText={(text) => {
                  setPassword(text.trim());
                }}
                value={password}
                placeholder={"Password"}
                editable={true}
                height={60}
                borderRadius={15}
                margin={20}
                validate={(value) => ({
                  isValid: Validator.password(value),
                  message: 'Needs to be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
                })}
                label={"Password"}


              />
              <InputBox
                onChangeText={(text) => {
                  setConfirmPassword(text.trim());
                }}
                value={confirmPassword}
                placeholder={"Confirm Password"}
                editable={true}
                height={60}
                borderRadius={15}
                margin={20}
                validate={(value) => ({
                  isValid: value.trim().length > 8,
                  message: 'Please confirm your password.',
                })}
                label={"Confirm Password"}
              />
              <InputBox
                onChangeText={(text) => {
                  setName(text.toLowerCase());
                }}
                value={name}
                placeholder={"Full Name"}
                editable={true}
                height={60}
                borderRadius={15}
                margin={20}
                validate={(value) => ({
                  isValid: Validator.name(value),
                  message: 'This field must be a valid name.',
                })}
              />
              <InputBox
                onChangeText={(text) => {
                  setDob(text?.trim());
                }}
                keyboardType={"numeric"}
                value={dob}
                placeholder={"Date of Birth (DD/MM/YYYY)"}
                editable={true}
                height={60}
                borderRadius={15}
                margin={20}
                validate={(value) => ({
                  isValid: Validator.date(value),
                  message: 'This field must be a valid date.',
                })
                }
                formatter={(value) => Formatter.formatDateNumbers(value)}
              />
              <InputBox
                onChangeText={(text) => {
                  setPhoneNumber(text.trim());
                }}
                keyboardType={"numeric"}
                value={phoneNumber}
                placeholder={"Phone Number"}
                editable={true}
                height={60}
                borderRadius={15}
                margin={20}
                validate={(value) => ({
                  isValid: Validator.phoneNumber(value),
                  message: 'This field must be a valid phone number.',
                })
                }
                formatter={(value) => Formatter.formatPhoneNumber(value)}
              />

              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 20,
                }}
              >
                Select the language you want to learn
              </Text>
              <View>
                <ProceduralCheckBox
                  multiSelect={false}
                  options={["English", "Spanish", "French", "Portuguese"]}
                  onUpdateSelectedOptions={(selectedOptions) => {
                    const lang = selectedOptions[0];
                    if (lang !== language && lang && lang !== "") {
                      setLanguage(lang);
                    }
                  }}
                  textColor={"#FFFFFF"}
                />
              </View>

              <MainButton
                onPress={validateAndSubmit}
                title={"Create Account"}
                marginVertical={10}
                marginBottom={40}
                isLoading={loading}
              />
            </View>
          );
        }}
        keyExtractor={(item) => item}
      />
    </KeyboardAvoidingView>
  );
};

export default signup;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
    width: Dimensions.get("screen").width,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 50,
  },
});
