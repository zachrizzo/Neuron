import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import InputBox from "../inputs/inputBox"; // Ensure this is the correct path
import MainButton from "../buttons/mainButton";
import { colorsDark } from "../../utility/color";
import RoundButton from "../buttons/roundButtons";
import { Feather } from "@expo/vector-icons";

const GrammarLesson = ({
  taskDescription,
  text,
  correctAnswer,
  hints,
  setIsCorrect,
  setCorrectAnswer,
  setGivenAnswer,
}) => {
  const [userAnswer, setUserAnswer] = useState("");

  const handleSubmit = () => {
    if (
      userAnswer?.toLowerCase().trim() === correctAnswer?.toLowerCase().trim()
    ) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
      setCorrectAnswer(correctAnswer.toLowerCase().trim());
      setGivenAnswer(userAnswer.toLowerCase().trim());
    }

    setUserAnswer(""); // Reset input after submission
  };

  return (
    <View style={styles.container}>
      <Text style={styles.taskDescriptionText}>{taskDescription}</Text>

      <View style={styles.container2}>
        <View style={styles.textView}>
          <Text style={styles.text}>{text}</Text>
          <RoundButton
            onPress={() => Alert.alert("Hint", `${hints}`)}
            title={"Hint"}
            backgroundColor={colorsDark.blue}
            size={30}
            margin={10}
            color={"#FFFFFF00"}
            icon={<Feather name="info" size={20} color={colorsDark.green} />}
          />
        </View>
        <InputBox
          value={userAnswer}
          onChangeText={(text) => setUserAnswer(text)}
          placeholder="Enter your answer"
          height={50}
          textColor={colorsDark.white}
        />
        <MainButton onPress={handleSubmit} title={"Submit"} borderRadius={15} />
      </View>
    </View>
  );
};

export default GrammarLesson;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    width: "100%",
  },
  container2: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    width: "100%",
  },
  text: {
    fontSize: 18,
    // marginBottom: 20,
    color: "white",
  },
  taskDescriptionText: {
    color: colorsDark.blue,
    fontSize: 18,
    fontStyle: "italic",
    marginBottom: 20,
    textAlign: "center",
  },
  feedbackText: {
    marginTop: 20,
    fontSize: 16,
    color: colorsDark.blue,
  },
  textView: {
    flexDirection: "row",

    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
});
