import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  SafeAreaView,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import InputBox from "../components/inputs/inputBox";
import MainButton from "../components/buttons/mainButton";
import RoundButton from "../components/buttons/roundButtons";
import { loginEmailPassword, loginWithGoogle } from "../firebase/auth/user";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Stack, router } from "expo-router";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/userSlice";
import MorphingBall from "../components/morphingBall";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Listener for changes in the authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, navigate to the home page
        router.replace("/home");
      } else {
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        alert(error);
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Stack.Screen
        options={{
          headerShown: false,
          headerBackTitle: "Login",
        }}
      />
      <View style={styles.morphingBallBackground}>
        <MorphingBall />
      </View>
      <SafeAreaView style={styles.safeAreaView}>
        <Text
          style={{
            color: "#ffffff",
            fontSize: 40,
            zIndex: 20,
            marginBottom: 100,
          }}
        >
          Cortexx
        </Text>

        <InputBox
          onChangeText={(text) => {
            setEmail(text.toLowerCase());
          }}
          value={email}
          placeholder={"Email"}
          editable={true}
          height={60}
          borderRadius={15}
          fontSize={20}
        />
        <InputBox
          onChangeText={(text) => {
            setPassword(text);
          }}
          value={password}
          placeholder={"Password"}
          editable={true}
          height={60}
          borderRadius={15}
          fontSize={20}
        />
        <MainButton
          onPress={() => {
            setLoading(true);
            if (email && password) {
              loginEmailPassword(email, password)
                .then((res) => {
                  if (res && auth.currentUser) {
                    dispatch(setUser(res));
                    console.log("res", res);
                    setLoading(false);
                    // router.replace("/home");
                  }
                })
                .catch((error) => {
                  if (error.code === "auth/invalid-login-credentials") {
                    alert("Wrong password.");
                  } else if (error.code === "auth/user-not-found") {
                    alert("User not found.");
                  } else if (error.code === "auth/invalid-email") {
                    alert("Invalid email.");
                  } else {
                    alert(error.message);
                  }
                  setLoading(false);
                });
            } else {
              setLoading(false);
              alert("Please enter your email and password");
            }
          }}
          title={"Login"}
          marginVertical={10}
          isLoading={loading}
        />

        <MainButton
          onPress={() => {
            router.push("/signup");
          }}
          title={"Create Account"}
          marginVertical={10}
          marginBottom={40}
        />
        {/* <RoundButton
          onPress={() => {
            loginWithGoogle();
          }}
          icon={
            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
              G+
            </Text>
          }
          color={"#DB4437"}
          size={70}
        /> */}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  morphingBallBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 0,
  },
  safeAreaView: {
    width: "100%",
    flex: 1,
    backgroundColor: "transparent", // Ensure it's transparent
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  },
});
