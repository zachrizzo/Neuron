import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import InputBox from "../inputs/inputBox"; // Ensure this is the correct path
import MainButton from "../buttons/mainButton";

const WritingLesson = ({
  text,
  taskDescription,
  setIsCorrect,
  correctAnswer,
  setCorrectAnswer,
}) => {
  const [userTranslation, setUserTranslation] = useState("");

  const handleSubmit = () => {
    setIsCorrect(
      userTranslation.toLowerCase().trim() ===
        correctAnswer.toLowerCase().trim()
    );
    // Example check - you might want to handle this differently
    if (userTranslation.toLowerCase() === correctAnswer.toLowerCase()) {
      setIsCorrect(true);
    }
    //  else {
    //   setCorrectAnswer(correctAnswer);
    // }

    setUserTranslation(""); // Reset input after submission
  };
  console.log("text", text);
  console.log("translationText", taskDescription);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{taskDescription}</Text>
      <InputBox
        value={userTranslation}
        onChangeText={setUserTranslation}
        placeholder="Type your translation here"
        // width={"80%"}
        height={50}
      />

      <MainButton onPress={handleSubmit} title={"Submit"} borderRadius={15} />
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
  text: {
    fontSize: 18,
    marginBottom: 20,
    color: "white",
  },
  inputBox: {
    width: "100%",
    padding: 10,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
  },
});
