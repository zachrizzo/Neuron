import { StyleSheet, Text, View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentLesson } from "../redux/slices/userSlice";
import { Stack, router } from "expo-router";
import MainButton from "../components/buttons/mainButton";
import SpeakingLesson from "../components/lessonComponents/speakingLesson";
import WritingLesson from "../components/lessonComponents/writingLesson";
import ReadingLesson from "../components/lessonComponents/readingLesson";

const Lesson = () => {
  const [loading, setLoading] = useState(false);
  const currentLesson = useSelector(selectCurrentLesson);
  const [exercises, setExercises] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [missedQuestions, setMissedQuestions] = useState([]);
  const [correctQuestions, setCorrectQuestions] = useState([]);
  const [learnedWords, setLearnedWords] = useState([]);

  useEffect(() => {
    // Randomize exercises array when component mounts
    if (currentLesson?.exercises) {
      setExercises(shuffleArray([...currentLesson.exercises]));
    }
  }, [currentLesson]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleContinue = () => {
    // Notify the user
    // Alert.alert("Good Job!", "You have completed the exercise.");

    // Move to the next exercise or finish the lesson
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      // Increment completed lessons count
      setCompletedLessons([...completedLessons, currentLesson]);

      // Reset for next lesson or handle the end of lessons
      Alert.alert("Lesson Complete", "You have finished all exercises!");
      setCurrentExerciseIndex(0);
      // Additional logic for completing the lesson
    }
  };

  return (
    <View style={styles.backGroundContainer}>
      <Stack.Screen
        options={{
          title: currentLesson?.lessonTitle,
        }}
      />
      <View style={styles.lessonView}>
        {exercises[currentExerciseIndex]?.taskType == "Speaking" && (
          <SpeakingLesson
            text={exercises[currentExerciseIndex]?.text}
            translationText={exercises[currentExerciseIndex]?.translation}
            audioUrl={exercises[currentExerciseIndex]?.audioFilePath}
          />
        )}
        {exercises[currentExerciseIndex]?.taskType == "Writing" && (
          <WritingLesson />
        )}
        {exercises[currentExerciseIndex]?.taskType == "Reading" && (
          <ReadingLesson />
        )}
        {/* add listening */}
      </View>
      <View style={styles.buttonView}>
        <MainButton
          onPress={handleContinue}
          title={"Continue"}
          isLoading={loading}
          borderRadius={15}
        />
      </View>
      {/* Display the count of completed lessons */}
      <Text style={styles.completedLessonsText}>
        Completed Lessons: {completedLessons.length}
      </Text>
    </View>
  );
};

export default Lesson;

const styles = StyleSheet.create({
  backGroundContainer: {
    backgroundColor: "#000000",
    flex: 1,
    alignItems: "center",
  },
  lessonView: {
    flex: 0.75,
    alignItems: "center",
    width: "100%",
  },
  buttonView: {
    flex: 0.25,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  completedLessonsText: {
    color: "#FFF",
    fontSize: 16,
    margin: 10,
  },
});
