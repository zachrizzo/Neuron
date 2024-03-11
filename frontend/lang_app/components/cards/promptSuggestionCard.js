import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import DividerLine from "../layout/dividerLine";
import RoundButton from "../buttons/roundButtons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  setMessages,
  setThreadID,
  selectMessages,
  selectThreadID,
  selectUser,
  setIsCurrentChatALesson,
  selectIsCurrentChatALesson,
  setAllLessons,
  selectAllLessons,
} from "../../redux/slices/userSlice";
import LessonCard from "./lessonCard";
import { getAllLessons } from "../../firebase/lessons/lesson";
import { colorsDark } from "../../utility/color";
import { router } from "expo-router";
import { sendMessageWithVoiceReply } from "../../firebase/api/aiChat";

const PromptSuggestionCard = ({
  loading,
  recording,
  handleSpeechInput,
  startThread,
  language,
  setShowPromptPanel,
  setStartingPrompt,
  handleSendMessage,
  setLoading,
  user,
}) => {
  // const [lessons, setLessons] = useState([]);
  const dispatch = useDispatch();
  const isCurrentChatALesson = useSelector(selectIsCurrentChatALesson);
  const thread_id = useSelector(selectThreadID);
  const hasEffectRun = useRef(false);
  const messages = useSelector(selectMessages);
  const lessons = useSelector(selectAllLessons);

  useEffect(() => {
    getAllLessons(dispatch, setAllLessons);
  }, []);

  // console.log(lessons);

  useEffect(() => {
    // Check if conditions are met and the effect hasn't run yet
    if (
      thread_id &&
      isCurrentChatALesson &&
      hasEffectRun.current === false &&
      messages.length > 0
    ) {
      hasEffectRun.current = true;
      setLoading(true);
      handleSendMessage(
        messages,
        null,
        null,
        "fr_Lesson1_alphabet_pronunciation"
      );
      return () => {
        hasEffectRun.current = true;
      };
    }
  }, [thread_id]); // Depend on the actual state variables

  // console.log(prompts);

  return (
    <View style={styles.card}>
      <FlatList
        data={lessons}
        style={{ width: "100%" }}
        renderItem={({ item, index }) => {
          return (
            <View
              style={{
                marginLeft:
                  index == 0 ? Dimensions.get("screen").width / 5 : null,
              }}
            >
              <LessonCard
                setShowPromptPanel={setShowPromptPanel}
                startThread={startThread}
                lesson={item}
                setStartingPrompt={setStartingPrompt}
                handleSendMessage={handleSendMessage}
                setLoading={setLoading}
              />
            </View>
          );
        }}
        keyExtractor={(item) => item.id.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
      <DividerLine color={"#FFFFFFB6"} marginVertical={30} />
      <Text
        style={{
          color: colorsDark.white,
          marginVertical: 10,
          fontSize: 18,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        What topic do you want to have a mock {language} conversation in today?
      </Text>
      <RoundButton
        icon={
          <MaterialCommunityIcons
            name="microphone-outline"
            size={24}
            color="white"
          />
        }
        size={70}
        color={recording && user?.numberOfMessages > 0 ? "red" : "#007bff"}
        onPress={async () => {
          handleSpeechInput();
          // sendMessageWithVoiceReply(
          //   "1",
          //   [{ text: { role: "user", content: "Hello, dude!" } }],
          //   "general_lang_chat"
          // );
        }}
        marginVertical={30}
        disabled={loading}
      />
    </View>
  );
};

export default PromptSuggestionCard;

const styles = StyleSheet.create({
  card: {
    // backgroundColor: colorsDark.mainBackground, // backgroundColor: "#000000E7",
    width: "100%",

    borderRadius: 15,
    color: "#FFFFFF",
    marginBottom: 20,
    // marginHorizontal: 10,
    height: Dimensions.get("screen").height / 1.5,
    width: Dimensions.get("screen").width,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
});
