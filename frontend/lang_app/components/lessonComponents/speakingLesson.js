import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import RoundButton from "../buttons/roundButtons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/userSlice";

const SpeakingLesson = ({ text, translationText }) => {
  const [recording, setRecording] = useState(false);
  const user = useSelector(selectUser);
  const lang = user?.language;

  // useEffect(() => {
  //   // Set up event listeners
  //   Speech.addListener("speakingStarted", () =>
  //     console.log("Speaking started")
  //   );
  //   Speech.addListener("speakingWillSayNextString", () =>
  //     console.log("Will say next string")
  //   );
  //   Speech.addListener("speakingDone", () => console.log("Speaking done"));

  //   // Clean up event listeners
  //   return () => {
  //     Speech.removeAllListeners("speakingStarted");
  //     Speech.removeAllListeners("speakingWillSayNextString");
  //     Speech.removeAllListeners("speakingDone");
  //   };
  // }, []);

  // const speak = () => {
  //   const thingToSay = "bonjour";
  //   Speech.speak(text, {
  //     language: lang,
  //     onDone: () => console.log("Done speaking"),
  //     onStopped: () => console.log("Stopped speaking"),
  //     onStarted: () => console.log("Started speaking"),
  //   });
  //   console.log("speak");
  // };
  const speak = () => {
    const thingToSay = "bonjour";
    Speech.speak(thingToSay, {
      language: "fr",
      onDone: () => console.log("Done speaking"),
    });
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.textView}>
        <Text style={styles.text}>{text}</Text>
        <Text style={styles.translationText}>{translationText}</Text>
      </View>
      <RoundButton
        icon={
          <MaterialCommunityIcons
            name="microphone-outline"
            size={24}
            color="white"
          />
        }
        size={70}
        color={recording ? "red" : "#007bff"}
        onPress={speak}
      />
    </View>
  );
};

export default SpeakingLesson;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    justifyContent: "space-between",
  },
  textView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },

  text: {
    color: "#FFFFFF",
    fontSize: 50,
    textAlign: "center",
    marginHorizontal: 20,
  },
  translationText: {
    color: "#CCCCCCC3",
    fontSize: 25,
    marginTop: 20,
    marginBottom: 100,
  },
});
