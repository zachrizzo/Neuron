import { Button, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import MainButton from "../components/buttons/mainButton";
import { auth } from "../firebase/firebase";
import ProceduralCheckBox from "../components/inputs/proceduralCheckBox";
import { selectLang } from "../helperFunctions/helper";
import { Stack, router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUserAutoSpeak } from "../redux/slices/userSlice";
import { setUser, setUserLanguage } from "../redux/slices/userSlice";
import { updateUser } from "../firebase/users/user";
import { createPertainingData } from "../api/messaging/assistant";
import SwitchWithLabel from "../components/inputs/switchWithLabel";
import { colorsDark } from "../utility/color";
import RoundButton from "../components/buttons/roundButtons";
import { Ionicons } from "@expo/vector-icons";

const settings = () => {
  const [language, setLanguage] = useState([]);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);

  useEffect(() => {
    if (user?.language) {
      setLanguage(user.language);
    }
    if (user?.autoSpeak !== undefined) {
      setAutoSpeak(user.autoSpeak);
    }
  }, []);

  useEffect(() => {
    if (autoSpeak) {
      dispatch(setUserAutoSpeak({ autoSpeak: true }));
      updateUser(auth.currentUser.uid, { autoSpeak: true });
    } else {
      dispatch(setUserAutoSpeak({ autoSpeak: false }));
      updateUser(auth.currentUser.uid, { autoSpeak: false });
    }
  }, [autoSpeak]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => {
            return (
              <RoundButton
                color={"#FFFFFF00"}
                icon={
                  <Ionicons
                    name="arrow-down"
                    size={24}
                    color={colorsDark.white}
                  />
                }
                onPress={() => {
                  router.push("/home");
                }}
              />
            );
          },
        }}
      />
      {user && (
        <Text style={{ color: colorsDark.white, marginVertical: 15 }}>
          {/* Welcome {user?.name.toUpperCase()}! */}
        </Text>
      )}
      <View style={styles.subSubscriptionTextView}>
        <Text style={styles.subSubscriptionText}>
          Your on the{" "}
          <Text style={{ color: colorsDark.yellow }}>
            {user?.subscriptionStatus?.identifier}
          </Text>
          , to upgrade see our
        </Text>
        <Button
          onPress={() => {
            router.push("/home");
            router.push("/subscriptions");
          }}
          style={[styles.subSubscriptionText, {}]}
          title="plans"
        />
      </View>
      <MainButton
        onPress={() => {
          auth.signOut().then(() => {
            router.replace("/");
          });
        }}
        title={"Logout"}
        marginVertical={20}
      />
      <Text style={styles.text}>Select a Language You Wanna Learn</Text>
      <View>
        <ProceduralCheckBox
          multiSelect={false}
          options={["English", "Spanish", "French", "Portuguese", "Italian"]}
          onUpdateSelectedOptions={(selectedOptions) => {
            const lang = selectedOptions[0];

            if (
              user &&
              lang !== user.language &&
              lang &&
              lang !== "" &&
              lang.length > 0 &&
              lang[0].length > 0
            ) {
              // dispatch(setUserLanguage({ language: lang }));
              updateUser(auth.currentUser.uid, { language: lang });
            }
          }}
          textColor={"#FFFFFF"}
          defaultValues={language}
        />
      </View>
      <SwitchWithLabel
        label={"Auto Speak The Reply"}
        isEnabled={autoSpeak}
        setIsEnabled={setAutoSpeak}
      />
      {user?.role === "owner" && (
        <MainButton
          onPress={async () => {
            setLoading(true);
            try {
              const result = await createPertainingData();
              if (result) {
                // Do something with the result, e.g., display a success message
                Alert.alert("Success", "Training data created.");
                // Optional: Navigate to another screen if needed
                // router.replace("/some-other-route");
                setLoading(false);
              }
            } catch (error) {
              // Error handling if needed
              console.error("Error in creating training data:", error);
              Alert.alert("Error", "Failed to create training data.");
              setLoading(false);
            }
          }}
          title={"Create Training Data"}
          marginVertical={20}
          isLoading={loading}
        />
      )}
    </View>
  );
};

export default settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorsDark.mainBackground,
    alignItems: "center",
    // justifyContent: "center",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 20,
  },
  subSubscriptionText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontStyle: "italic",
  },
  subSubscriptionTextView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
