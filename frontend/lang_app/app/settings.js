import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import MainButton from "../components/buttons/mainButton";
import { auth } from "../firebase/firebase";
import ProceduralCheckBox from "../components/inputs/proceduralCheckBox";
import { selectLang } from "../helperFunctions/helper";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUserAutoSpeak } from "../redux/slices/userSlice";
import { setUser, setUserLanguage } from "../redux/slices/userSlice";
import { updateUser } from "../firebase/users/user";
import { createPertainingData } from "../api/messaging/assistant";
import SwitchWithLabel from "../components/inputs/switchWithLabel";

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
      updateUser(auth.currentUser.email, { autoSpeak: true });
    } else {
      dispatch(setUserAutoSpeak({ autoSpeak: false }));
      updateUser(auth.currentUser.email, { autoSpeak: false });
    }
  }, [autoSpeak]);

  return (
    <View style={styles.container}>
      {user && (
        <Text style={{ color: "white", marginVertical: 15 }}>
          {/* Welcome {user?.name.toUpperCase()}! */}
        </Text>
      )}
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
          options={["English", "Spanish", "French", "Portuguese"]}
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
              dispatch(setUserLanguage({ language: lang }));
              updateUser(auth.currentUser.email, { language: lang });
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
                console.log(result);
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
    backgroundColor: "#000000E7",
    alignItems: "center",
    // justifyContent: "center",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 20,
  },
});
