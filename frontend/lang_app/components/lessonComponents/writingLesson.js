import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import InputBox from "../inputs/inputBox"; // Ensure this is the correct path
import MainButton from "../buttons/mainButton";
import { colorsDark } from "../../utility/color";
import { removePunctuation } from "../../helperFunctions/helper";

const WritingLesson = ({
  text,
  translation,
  gender,
  taskDescription,
  setIsCorrect,
  setCorrectAnswer,
  setGivenAnswer,
}) => {
  const [userTranslation, setUserTranslation] = useState("");

  const handleSubmit = () => {
    // Example check - you might want to handle this differently
    if (
      removePunctuation(userTranslation.toLowerCase().trim()) ===
      removePunctuation(translation.toLowerCase().trim())
    ) {
      setIsCorrect(true);
    } else {
      setCorrectAnswer(translation);
      setIsCorrect(false);
      setGivenAnswer(userTranslation);
    }

    setUserTranslation(""); // Reset input after submission
  };
  console.log("text", text);
  console.log("translationText", taskDescription);

  return (
    <View style={styles.container}>
      <Text style={styles.taskDescriptionText}>{taskDescription}</Text>
      <View style={styles.container2}>
        <Text style={styles.text}>{text}</Text>
        <InputBox
          value={userTranslation}
          onChangeText={setUserTranslation}
          placeholder="Write the translation here"
          // width={"80%"}
          height={50}
        />

        <MainButton onPress={handleSubmit} title={"Submit"} borderRadius={15} />
      </View>
    </View>
  );
};

export default WritingLesson;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    // backgroundColor: "#fff",
    width: "100%",
  },
  container2: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    // backgroundColor: "#fff",
    width: "100%",
  },

  text: {
    fontSize: 18,
    marginBottom: 20,
    color: "white",
  },

  taskDescriptionText: {
    color: colorsDark.blue,
    fontSize: 18,
    fontStyle: "italic",
    marginBottom: 20,
    textAlign: "center",
  },
});
