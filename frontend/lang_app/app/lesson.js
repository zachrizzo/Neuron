import { StyleSheet, Text, View, Alert, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentLesson,
  selectUser,
  setUserCortexxCoins,
  setUserHearts,
} from "../redux/slices/userSlice";
import { Stack, router } from "expo-router";
import MainButton from "../components/buttons/mainButton";
import SpeakingLesson from "../components/lessonComponents/speakingLesson";
import WritingLesson from "../components/lessonComponents/writingLesson";
import ReadingLesson from "../components/lessonComponents/readingLesson";
import ExerciseNotification from "../components/notification/exerciseNotification";
import { colorsDark } from "../utility/color";
import HorizontalProgressBar from "../components/charts/horizontalProgressBar";
import LifeIndicator from "../components/gamification/lifeIndicator";
import ListeningLesson from "../components/lessonComponents/listeningLesson";
import ConversationLesson from "../components/lessonComponents/conversationLesson";
import GrammarLesson from "../components/lessonComponents/grammarLesson";
import VocabularyLesson from "../components/lessonComponents/vocabularyLesson";
import CortexCoins from "../components/gamification/cortexCredits";
import * as Haptics from "expo-haptics";
import { updateUser } from "../firebase/users/user";
import { auth } from "../firebase/firebase";
import LessonRatingComponent from "../components/lessonComponents/lessonRatingComponent";
import MessageModal from "../components/layout/messageModal";
import { updateLesson } from "../firebase/lessons/lesson";

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
  const [givenAnswer, setGivenAnswer] = useState(null);
  const [lessonRating, setLessonRating] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const currentExercise = exercises[currentExerciseIndex];
  const exerciseText = currentExercise?.text;
  const exerciseGender = currentExercise?.gender;
  const exerciseTaskDescription = currentExercise?.taskDescription;
  const exerciseTranslation = currentExercise?.translation;
  const exerciserAudioFilePath = currentExercise?.audioFilePath;
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const cortexxCoins = user?.cortexxCoins;
  const hearts = user?.hearts;

  useEffect(() => {
    // Randomize exercises array when component mounts
    if (currentLesson?.exercises) {
      setExercises(shuffleArray([...currentLesson.exercises]));
    }
    // Randomize conversation exercises array when component mounts
    // if (currentLesson?.exercises) {
    //   const conversationExercises = currentLesson.exercises.filter(
    //     (exercise) => exercise.type === "conversation"
    //   );
    //   setExercises(shuffleArray([...conversationExercises]));
    // }
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
    // Calculate average fluency score
    if (fluencyHistory.length > 0) {
      const averageFluencyScore =
        fluencyHistory.reduce((a, b) => a + b) / fluencyHistory.length;
      console.log("averageFluencyScore", averageFluencyScore);
    }

    if (fluencyHistory.length > 0) {
      setFluencyScore(null);
    }

    if (lessonRating !== null) {
      setShowRatingModal(true);
    }

    updateLesson(currentLesson.lessonTitle, {
      fluencyScore: fluencyScore,
      lessonRating: lessonRating,
      fluencyHistory: fluencyHistory,
      completedLessons: completedLessons,
      missedQuestions: missedQuestions,
      correctQuestions: correctQuestions,
    });
  }, [
    fluencyScore,
    lessonRating,
    fluencyHistory,
    currentExerciseIndex,
    completedLessons,
    missedQuestions,
  ]);

  const handleContinue = () => {
    // Move to the next exercise or finish the lesson
    setLessonRating(null);
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      if (isCorrect) {
        setCorrectQuestions([...correctQuestions, currentExerciseIndex]);
        setCompletedLessons(completedLessons + 1);
        let newCortexxCoins = cortexxCoins + currentExercise?.points;

        dispatch(
          setUserCortexxCoins({
            cortexxCoins: newCortexxCoins,
          })
        );
        updateUser(auth.currentUser.uid, {
          cortexxCoins: newCortexxCoins,
        });

        // remove the lesson form the lis or append missing to try again
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setMissedQuestions([...missedQuestions, currentExerciseIndex]);
        let newHearts = hearts - 1;
        dispatch(setUserHearts({ hearts: newHearts }));
        updateUser(auth.currentUser.uid, { hearts: newHearts });
        setCorrectAnswer("");
      }
    } else {
      // Increment completed lessons count
      setCompletedLessons([...completedLessons, currentLesson]);

      // Reset for next lesson or handle the end of lessons
      Alert.alert("Lesson Complete", "You have finished all exercises!");
      setCurrentExerciseIndex(0);
    }
    setIsCorrect(null);
  };

  return (
    <View style={styles.backGroundContainer}>
      <Stack.Screen
        options={{
          title: currentLesson?.lessonTitle.split(" ").slice(0, 2).join(" "),
          headerRight: () => (
            <View style={{ flexDirection: "row" }}>
              <CortexCoins
                isGold={true}
                cortexCoins={cortexxCoins?.toString()}
                showAmountChange={true}
              />

              <LifeIndicator currentLives={hearts} totalLives={10} />
            </View>
          ),
        }}
      />

      <FlatList
        data={[1]}
        style={{ width: "100%" }}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          console.log(currentExercise?.taskType);
          return (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <MessageModal
                visible={showRatingModal}
                setModalVisible={setShowRatingModal}
                isLesson={true}
                lessonRating={lessonRating}
                lessonID={currentLesson?.id}
                exerciseID={currentExercise?.exerciseID}
              />
              <HorizontalProgressBar
                progress={
                  completedLessons > 0 && exercises
                    ? Math.round(
                      (completedLessons.length / exercises.length) * 100
                    )
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
                    {currentExercise?.taskType == "Speaking" && (
                      <SpeakingLesson
                        text={exerciseText}
                        translationText={exerciseTranslation}
                        audioUrl={exerciserAudioFilePath}
                        taskDescription={exerciseTaskDescription}
                        setIsCorrect={setIsCorrect}
                        setFluencyScore={setFluencyScore}
                        fluencyScore={fluencyScore}
                      />
                    )}
                    {currentExercise?.taskType == "Writing" && (
                      <WritingLesson
                        text={exerciseText}
                        taskDescription={exerciseTaskDescription}
                        translation={exerciseTranslation}
                        setIsCorrect={setIsCorrect}
                        setCorrectAnswer={setCorrectAnswer}
                        gender={exerciseGender}
                        setGivenAnswer={setGivenAnswer}
                      />
                    )}
                    {currentExercise?.taskType == "Reading" && (
                      <ReadingLesson
                        text={exerciseText}
                        translationText={exerciseTranslation}
                        taskDescription={exerciseTaskDescription}
                        audioUrl={exerciserAudioFilePath}
                        setIsCorrect={setIsCorrect}
                        translationOptions={currentExercise?.translationOptions}
                        setGivenAnswer={setGivenAnswer}
                        setCorrectAnswer={setCorrectAnswer}
                      />
                    )}
                    {currentExercise?.taskType == "Listening" && (
                      <ListeningLesson
                        translation={exerciseTranslation}
                        text={exerciseText}
                        taskDescription={exerciseTaskDescription}
                        options={currentExercise?.options}
                        audioUrl={exerciserAudioFilePath}
                        setIsCorrect={setIsCorrect}
                        setGivenAnswer={setGivenAnswer}
                        setCorrectAnswer={setCorrectAnswer}
                      />
                    )}
                    {currentExercise?.taskType == "Conversation" && (
                      <ConversationLesson
                        taskDescription={exerciseTaskDescription}
                        conversationSteps={currentExercise?.conversationSteps}
                        setIsCorrect={setIsCorrect}
                        setFluencyScore={setFluencyScore}
                      />
                    )}
                    {currentExercise?.taskType == "Vocabulary" && (
                      <VocabularyLesson
                        taskDescription={exerciseTaskDescription}
                        options={currentExercise?.options}
                        setIsCorrect={setIsCorrect}
                        targetLanguage={"French"}
                      />
                    )}
                    {currentExercise?.taskType == "Grammar" && (
                      <GrammarLesson
                        taskDescription={exerciseTaskDescription}
                        text={exerciseText}
                        correctAnswer={currentExercise?.correctAnswer}
                        hints={currentExercise?.hints}
                        setIsCorrect={setIsCorrect}
                        setCorrectAnswer={setCorrectAnswer}
                        setGivenAnswer={setGivenAnswer}
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
                    correctAnswer={correctAnswer}
                    handleContinue={handleContinue}
                    isCorrect={isCorrect}
                    givenAnswer={givenAnswer}
                  />
                )}
              </View>
              <View style={styles.lessonRatingView}>
                <LessonRatingComponent
                  rating={lessonRating}
                  setRating={setLessonRating}
                />
              </View>
            </View>
          );
        }}
      />
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
    flex: 0.99,
    alignItems: "center",
    width: "100%",
    justifyContent: "space-around",
  },

  completedLessonsText: {
    color: "#00FF00",
    fontSize: 25,
    margin: 10,
  },
  lessonRatingView: {
    marginVertical: 20,
  },
});
