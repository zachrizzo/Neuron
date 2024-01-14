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

const signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const dispatch = useDispatch();
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateAndSubmit = () => {
    setLoading(true);
    if (!email) {
      Alert.alert("Missing Information", "Please enter your email.");
      return;
    }
    if (!password) {
      Alert.alert("Missing Information", "Please enter a password.");
      return;
    }
    if (password.length < 6) {
      Alert.alert(
        "Invalid Password",
        "Password should be at least 6 characters long."
      );
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }
    if (!name) {
      Alert.alert("Missing Information", "Please enter your full name.");
      return;
    }
    if (!dob || dob.length !== 10) {
      Alert.alert(
        "Missing Information",
        "Please check your date of birth to make sure its valid."
      );
      return;
    }
    if (!language) {
      Alert.alert("Missing Information", "Please select a language.");
      return;
    }

    const userInfo = {
      name,
      dob,
      email,
      language,
      autoSpeak: true,
      cortexxCoin: 0,
      Hearts: 10,
      heartsLastRefill: new Date(),
      numberOfMessages: 20,
      subscriptionStatus: "free",
    };
    createUserEmailAndPassword(email, password, userInfo)
      .then((res) => {
        dispatch(setUser(res.userData));
        setLoading(false);
        router.replace("/home");
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
              />
              <InputBox
                onChangeText={(text) => {
                  //auto format date(DD/MM/YYYY)
                  if (text.length === 2 && dob.length !== 3) {
                    text = text + "/";
                  } else if (text.length === 5 && dob.length !== 6) {
                    text = text + "/";
                  }
                  //prohibit user from entering more than 10 characters
                  if (text.length > 10) {
                    text = text.substring(0, 10);
                  }

                  setDob(text.trim());
                }}
                keyboardType={"numeric"}
                value={dob}
                placeholder={"Date of Birth (DD/MM/YYYY)"}
                editable={true}
                height={60}
                borderRadius={15}
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
