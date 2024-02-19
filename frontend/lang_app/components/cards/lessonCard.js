import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import CircularProgress from "../charts/circularProgress";
import HorizontalProgressBar from "../charts/horizontalProgressBar";
import { useDispatch, useSelector } from "react-redux";
import {
  setMessages,
  setThreadID,
  selectMessages,
  selectThreadID,
  selectUser,
  setIsCurrentChatALesson,
  selectIsCurrentChatALesson,
  setCurrentLesson,
} from "../../redux/slices/userSlice";
import { router } from "expo-router";
import { colorsDark } from "../../utility/color";

const LessonCard = ({
  lesson,
  startThread,
  setShowPromptPanel,
  setStartingPrompt,
  handleSendMessage,
  setLoading,
}) => {
  const [promptKeys, setPromptKeys] = useState([]);
  const [shouldStartThread, setShouldStartThread] = useState(false);
  const [correctPercentage, setCorrectPercentage] = useState(0);
  const [mistakesPercentage, setMistakesPercentage] = useState(0);
  const [fluencyPercentage, setFluencyPercentage] = useState(0);

  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    if (lesson?.promptsMap) {
      const keys = Object.keys(lesson.promptsMap);
      // console.log(keys);
      setPromptKeys(keys);
    }
    //get percentage of correct answers
    if (lesson?.correctQuestions && lesson?.completedLessons.length > 0) {
      setCorrectPercentage(
        (lesson?.correctQuestions?.length / lesson?.completedLessons?.length) *
          100
      );
    }
    //get percentage of mistakes
    if (
      lesson?.missedQuestions?.length &&
      lesson?.completedLessons.length > 0
    ) {
      setMistakesPercentage(
        (lesson?.missedQuestions?.length / lesson?.completedLessons?.length) *
          100
      );
    }
    //get percentage of fluency
    if (lesson?.fluency) {
      setFluencyPercentage(lesson.fluencyScore);
    }
  }, [lesson]);

  useEffect(() => {
    let isMounted = true;
    if (shouldStartThread && isMounted) {
      startThread().then(() => {
        dispatch(setIsCurrentChatALesson(true));
        setShowPromptPanel(false);
        setShouldStartThread(false);
      });
      console.log("starting thread");
    }
    return () => {
      isMounted = false;
    };
  }, [shouldStartThread]);

  return (
    <TouchableOpacity
      onPress={() => {
        //dispatch the lesson
        dispatch(setCurrentLesson(lesson));
        //route to the lesson page
        router.push("/lesson");
      }}
    >
      <Text style={styles.promptText}>{lesson?.lessonTitle}</Text>
      <View style={styles.promptCard}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            flex: 0.35,
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            <Text
              style={{ textAlign: "center", fontSize: 30, color: "#FFFFFFD8" }}
            >
              {lesson?.completedLessons?.length}/{lesson?.exercises?.length}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            flex: 0.425,
          }}
        >
          <CircularProgress
            size={80}
            strokeWidth={10}
            progress={correctPercentage}
            color={colorsDark.green}
            backGroundColor={colorsDark.secondary}
            label={"Correct"}
            progressTextLeft={40}
            progressTextTop={75}
          />

          <CircularProgress
            size={80}
            strokeWidth={10}
            progress={mistakesPercentage}
            color={colorsDark.red}
            label={"Mistakes"}
            backGroundColor={colorsDark.secondary}
            progressTextLeft={40}
            progressTextTop={75}
          />
        </View>
        <View
          style={{
            flex: 0.275,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <HorizontalProgressBar
            progress={fluencyPercentage}
            height={15}
            backgroundColor={colorsDark.secondary}
            progressColor={colorsDark.yellow}
            width={"80%"}
            margin={5}
            label={"Fluency"}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default LessonCard;

const styles = {
  promptText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
    justifyContent: "center",
    textAlign: "center",
    marginBottom: 10,
  },
  promptCard: {
    backgroundColor: colorsDark.accent, // backgroundColor: "#000000E7",
    width: "60%",
    borderRadius: 15,

    color: "#FFFFFF",
    marginBottom: 20,
    marginHorizontal: 20,
    width: 220,
    padding: 15,
    height: "90%",
  },
};
