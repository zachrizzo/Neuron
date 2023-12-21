import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Confetti from "./confetti";
import MainButton from "../buttons/mainButton"; // Assuming MainButton is imported from the correct path
import { colorsDark } from "../../utility/color";

const ExerciseNotification = ({
  message,
  isCorrect,
  handleContinue,
  correctAnswer,
  fluencyScore,
}) => {
  return (
    <View style={styles.container}>
      {isCorrect && <Confetti />}
      <View style={styles.messageView}>
        <Text
          style={[
            styles.messageText,
            {
              color: message === "Correct!" ? colorsDark.green : colorsDark.red,
            },
          ]}
        >
          {message}
        </Text>
        {fluencyScore && (
          <Text
            style={{
              color: fluencyScore > 70 ? colorsDark.green : colorsDark.green,
              fontWeight: "bold",
            }}
          >
            Fluency Score: {fluencyScore}%
          </Text>
        )}
        {message === "Incorrect!" && (
          <Text style={styles.correctAnswerText}>
            The correct answer is:{" "}
            <Text style={{ color: "blue", fontWeight: "bold" }}>
              {correctAnswer}
            </Text>
          </Text>
        )}
      </View>
      <View style={styles.buttonView}>
        <MainButton
          onPress={handleContinue}
          title={"Continue"}
          borderRadius={15}
        />
      </View>
    </View>
  );
};

export default ExerciseNotification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorsDark.mainBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  messageView: {
    position: "absolute",
    top: "30%", // Adjust positioning as needed
    backgroundColor: "#FFFFFF",
    padding: 30,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  messageText: {
    fontSize: 50,
    fontWeight: "bold",
  },
  buttonView: {
    position: "absolute",
    bottom: "20%", // Adjust the positioning as needed
    width: "80%", // Adjust the width as needed
    alignItems: "center",
  },
  correctAnswerText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#303030AF",
  },
});
