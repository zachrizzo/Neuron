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

  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    if (lesson?.promptsMap) {
      const keys = Object.keys(lesson.promptsMap);
      // console.log(keys);
      setPromptKeys(keys);
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
              2/{lesson.totalTasks}
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
            progress={70}
            color={"#00FF33"}
            backGroundColor={"#FFFFFF00"}
            label={"Correct"}
            progressTextLeft={40}
            progressTextTop={75}
          />

          <CircularProgress
            size={80}
            strokeWidth={10}
            progress={10}
            color={"#FF4124C6"}
            label={"Mistakes"}
            backGroundColor={"#FFFFFF00"}
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
            progress={20}
            height={15}
            backgroundColor="#8E8E8E"
            progressColor="#FFFFFF"
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
    backgroundColor: "#A3A3A34F", // backgroundColor: "#000000E7",
    width: "60%",
    borderRadius: 15,

    color: "#FFFFFF",
    marginBottom: 20,
    marginHorizontal: 20,
    width: 200,
    padding: 10,
    height: "90%",
  },
};
