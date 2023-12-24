import { StyleSheet, Text, View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentLesson } from "../redux/slices/userSlice";
import { Stack, router } from "expo-router";
import MainButton from "../components/buttons/mainButton";
import SpeakingLesson from "../components/lessonComponents/speakingLesson";
import WritingLesson from "../components/lessonComponents/writingLesson";
import ReadingLesson from "../components/lessonComponents/readingLesson";
import ExerciseNotification from "../components/notification/exerciseNotification";
import { colorsDark } from "../utility/color";
import HorizontalProgressBar from "../components/charts/horizontalProgressBar";
import LifeIndicator from "../components/gamification/lifeIndicator";

const Lesson = () => {
  const [loading, setLoading] = useState(false);
  const currentLesson = useSelector(selectCurrentLesson);
  const [exercises, setExercises] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [missedQuestions, setMissedQuestions] = useState([]);
  const [correctQuestions, setCorrectQuestions] = useState([]);
  const [learnedWords, setLearnedWords] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [fluencyScore, setFluencyScore] = useState(null);
  const [fluencyHistory, setFluencyHistory] = useState([]);
  const [livesLeft, setLivesLeft] = useState(10);

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

  // Add fluency score to history
  useEffect(() => {
    if (fluencyScore) {
      setFluencyHistory([...fluencyHistory, fluencyScore]);
    }
  }, [fluencyScore]);

  // Calculate average fluency score
  useEffect(() => {
    if (fluencyHistory.length > 0) {
      const averageFluencyScore =
        fluencyHistory.reduce((a, b) => a + b) / fluencyHistory.length;
      console.log("averageFluencyScore", averageFluencyScore);
    }
  }, [fluencyHistory]);

  useEffect(() => {
    if (fluencyHistory.length > 0) {
      setFluencyScore(null);
    }
  }, [currentExerciseIndex]);

  const handleContinue = () => {
    // Notify the user
    // Alert.alert("Good Job!", "You have completed the exercise.");

    // Move to the next exercise or finish the lesson
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      if (isCorrect) {
        setCorrectQuestions([...correctQuestions, currentExerciseIndex]);
        setCompletedLessons(completedLessons + 1);
        // remove the lesson form the lis or append missing to try again
      } else {
        setMissedQuestions([...missedQuestions, currentExerciseIndex]);
        setLivesLeft(livesLeft - 1);
      }
    } else {
      // Increment completed lessons count
      setCompletedLessons([...completedLessons, currentLesson]);

      // Reset for next lesson or handle the end of lessons
      Alert.alert("Lesson Complete", "You have finished all exercises!");
      setCurrentExerciseIndex(0);
      // Additional logic for completing the lesson
    }
    setIsCorrect(null);
  };

  return (
    <View style={styles.backGroundContainer}>
      <Stack.Screen
        options={{
          title: currentLesson?.lessonTitle.split(" ").slice(0, 2).join(" "),
          headerRight: () => (
            <LifseIndicator currentLives={livesLeft} totalLives={10} />
          ),
        }}
      />
      <HorizontalProgressBar
        progress={
          completedLessons > 0 && exercises
            ? Math.round((completedLessons.length / exercises.length) * 100)
            : 0
        }
        height={15}
        backgroundColor={colorsDark.secondary}
        progressColor={colorsDark.purple}
        width={"80%"}
        margin={5}
        label={""}
      />

      <View style={styles.lessonView}>
        {isCorrect === null ? (
          <>
            {exercises[currentExerciseIndex]?.taskType == "Speaking" && (
              <SpeakingLesson
                text={exercises[currentExerciseIndex]?.text}
                translationText={exercises[currentExerciseIndex]?.translation}
                audioUrl={exercises[currentExerciseIndex]?.audioFilePath}
                setIsCorrect={setIsCorrect}
                setFluencyScore={setFluencyScore}
                fluencyScore={fluencyScore}
              />
            )}
            {exercises[currentExerciseIndex]?.taskType == "Writing" && (
              <WritingLesson
                text={exercises[currentExerciseIndex]?.text}
                taskDescription={
                  exercises[currentExerciseIndex]?.taskDescription
                }
                correctAnswer={exercises[currentExerciseIndex]?.correctAnswer}
                setIsCorrect={setIsCorrect}
                setMissedQuestions={setMissedQuestions}
              />
            )}
            {exercises[currentExerciseIndex]?.taskType == "Reading" && (
              <ReadingLesson
                text={exercises[currentExerciseIndex]?.text}
                translationText={exercises[currentExerciseIndex]?.translation}
                audioUrl={exercises[currentExerciseIndex]?.audioFilePath}
                setIsCorrect={setIsCorrect}
                setMissedQuestions={setMissedQuestions}
              />
            )}
          </>
        ) : isCorrect ? (
          <ExerciseNotification
            isCorrect={isCorrect}
            message={"Correct!"}
            handleContinue={handleContinue}
            fluencyScore={fluencyScore}
          />
        ) : (
          <ExerciseNotification
            message={"Incorrect!"}
            correctAnswer={exercises[currentExerciseIndex]?.correctAnswer}
            handleContinue={handleContinue}
            isCorrect={isCorrect}
            setCorrectAnswer={setCorrectAnswer}
          />
        )}
        {/* add listening */}
      </View>
    </View>
  );
};

export default Lesson;

const styles = StyleSheet.create({
  backGroundContainer: {
    backgroundColor: colorsDark.mainBackground,
    flex: 1,
    alignItems: "center",
  },
  lessonView: {
    flex: 0.75,
    alignItems: "center",
    width: "100%",
  },

  completedLessonsText: {
    color: "#00FF00",
    fontSize: 25,
    margin: 10,
  },
});
