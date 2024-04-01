import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  StatusBar,
  FlatList,
  KeyboardAvoidingView,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import {
  createThread,
  createMessage,
  runAssistant,
  generateReply,
  textToSpeech,
  transcribeAudio,
  addMessageWithVoiceReply,
  addMessageWithVoiceReplyNoAssistant,
} from "../api/messaging/assistant";
import MainButton from "../components/buttons/mainButton";
import InputBox from "../components/inputs/inputBox";
import RoundButton from "../components/buttons/roundButtons";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import MorphingBall from "../components/morphingBall";
import { Stack, router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  pushSingleMessage,
  selectMessages,
  selectThreadID,
  selectUser,
  setIsCurrentChatALesson,
  setMessages as setMessagesRedux,
  setThreadID,
  setUserHearts,
  setUserHeartsLastRefill,
  setUserNumberOfMessages,
  setUserNumberOfMessagesLastRefill,
} from "../redux/slices/userSlice";
import { getUser, updateUser } from "../firebase/users/user";
import { auth } from "../firebase/firebase";
import { setUser } from "../redux/slices/userSlice";
import PromptSuggestionCard from "../components/cards/promptSuggestionCard";
import MessageThread from "../components/messaging/messageThread";
import { selectLang } from "../helperFunctions/helper";
import { v4 as uuidv4 } from "uuid";
import {
  addMessageToChat,
  createChat,
  getAllMessagesFromChat,
  updateChat,
  uploadAudioFile,
} from "../firebase/chats/chats";
import * as FileSystem from "expo-file-system";
import { playSpeech, stopPlaying } from "../helperFunctions/audioHelpers";
import MessageModal from "../components/layout/messageModal";
import { mainChatPrompt } from "../chats_config";
import LoadingComponent from "../components/layout/loadingComponent";
import { colorsDark } from "../utility/color";
import { BlurView } from "expo-blur";
import CortexCoins from "../components/gamification/cortexCredits";
import {
  sendMessageWithVoiceReply,
  addMessageFromVoiceInputWithAudioReply,
} from "../firebase_python/api/aiChat";

export default function App() {
  const reduxMessages = useSelector(selectMessages);
  const threadID = useSelector(selectThreadID);

  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState(threadID ? reduxMessages || [] : []);
  const [speechSound, setSpeechSound] = useState();
  const [recording, setRecording] = useState();
  const [loading, setLoading] = useState(false);
  const [isUsingAssistant, setIsUsingAssistant] = useState(false);
  const [showPromptPanel, setShowPromptPanel] = useState(true);
  const user = useSelector(selectUser);
  const [playingSound, setPlayingSound] = useState();
  const [playingMessageIndex, setPlayingMessageIndex] = useState(null);
  const [isSoundLoading, setIsSoundLoading] = useState(false);

  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [startingPrompt, setStartingPrompt] = useState(
    `What topic do you want to have a mock ${user?.language || 'en'} conversation in today?`
  );
  const [loadingUpdateMessage, setLoadingUpdateMessage] = useState(false);
  const [isKeyBoardInFocus, setIsKeyBoardInFocus] = useState(false);

  const numberOfMessagesLeft = user?.numberOfMessages;

  ///////more fine tuning
  //fix first sound
  //// disable auto speaking --done
  // x button to cancel the recording
  // re - gen audio button
  // make sure in the lesson chat the fine tuning is separate from the main chat --done
  // fix where the audios are saved and how the replays are done.
  // track user token usage
  // keep track of user message number
  // create a beta sign up key
  // fix goodbye in french --done i think
  // add a privacy policy
  // add a way to opt out of data collection if thats the only legal route
  // when rating a message make the button to submit visible but disabled until a rating is selected
  //in lessons add what the user wrote
  //add different fonts
  //add a setting to turn not show translation
  //add a translation button when word is highlighted
  // change users to use id instead of email

  useEffect(() => {
    if (threadID && threadID !== "") {
      // Set up the listener and capture the unsubscribe function
      const unsubscribe = getAllMessagesFromChat(threadID, (newMessages) => {
        dispatch(setMessagesRedux(newMessages));
      });

      return () => unsubscribe();
    }
  }, [threadID, dispatch]);





  useEffect(() => {
    setStartingPrompt(
      `What topic do you want to have a mock ${user?.language || 'en'} conversation in today?`
    );
  }, [user?.language]);

  useEffect(() => {
    //if prompt panel is showing stop playing
    if (showPromptPanel) {
      stopPlaying(playingSound, setPlayingSound, setPlayingMessageIndex);
    }
  }, [showPromptPanel]);

  useEffect(() => {
    if (threadID && messages.length > 1) {
      setShowPromptPanel(false);
    }
  }, [threadID]);

  const updateNumberOfMessages = async () => {
    dispatch(
      setUserNumberOfMessages({ numberOfMessages: numberOfMessagesLeft - 1 })
    );
    updateUser(auth.currentUser.uid, {
      numberOfMessages: numberOfMessagesLeft - 1,
    });
  };

  const startThread = async (promptID) => {
    if (numberOfMessagesLeft >= 0) {
      // Step 1: Create a thread
      setLoadingUpdateMessage("Creating a new conversation...");
      try {
        let threadData = "";
        if (isUsingAssistant) {
          threadData = await createThread();
        } else {
          // Generate a random thread ID
          threadData = { thread_id: uuidv4() };
        }
        const thread = threadData.thread_id;
        dispatch(setThreadID(thread));
        promptID = promptID ? promptID : 0;

        const systemMessage = {
          id: "system0",
          createdAt: new Date().toLocaleString(),
          text: {
            role: "system",
            content: startingPrompt,
          },
          type: "received",
        };

        //create chat in firebase
        createChat(thread, promptID, {
          id: 1,
          messages: [systemMessage],
        });
        //add to redux

        dispatch(pushSingleMessage(systemMessage));

        setMessages([systemMessage]);

        setLoadingUpdateMessage("Created a new conversation");
        return thread;
      } catch (error) {
        console.error("Error in startThread", error);
        setLoading(false);
        Alert.alert(
          "Error starting conversation",
          "Please try again, if the problem persists please contact support.",
          [
            {
              text: "OK",
              onPress: () => console.log("OK Pressed"),
              style: "cancel",
            },
          ],
          { cancelable: false }
        );
      }
    }
  };

  async function startRecording() {
    if (numberOfMessagesLeft >= 0) {
      try {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(recording);
      } catch (err) {
        console.error("Failed to start recording", err);
        Alert.alert(
          "Error starting recording, make sure you have given the app permission to use your microphone and the microphone is not in use by another app.",
          "Please try again, if the problem persists please contact support.",
          [
            {
              text: "OK",
              onPress: () => console.log("OK Pressed"),
              style: "cancel",
            },
          ],
          { cancelable: false }
        );
        setLoading(false);
        setRecording(undefined);
      }
    } else {
      Alert.alert(
        "Out of messages",
        "Please purchase more messages in the settings page",
        [
          {
            text: "OK",
            onPress: () => console.log("OK Pressed"),
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    }
  }

  const stopRecording = async () => {
    setLoading(true);
    try {
      setRecording(undefined);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      // Prepare the FormData object
      let formData = new FormData();
      formData.append("file", {
        uri: uri,
        type: "audio/m4a", // Make sure the MIME type matches the file type
        name: "recording.m4a",
      });
      const messagesString = JSON.stringify(reduxMessages);
      // Append other fields if necessary
      formData.append("conversationId", threadID);
      formData.append("messages", messagesString);
      formData.append("lang", selectLang(user?.language || "en"));

      response = await addMessageFromVoiceInputWithAudioReply(formData);

      const audioUrl = response.ai_message.audioUrl;

      if (user.autoSpeak == true || user.autoSpeak == undefined) {
        setPlayingMessageIndex(messages.length - 2);
        setPlayingSound();
        await playSpeech(
          audioUrl,
          messages.length,
          playingMessageIndex,
          setPlayingMessageIndex,
          setPlayingSound,
          setIsSoundLoading
        );
      }
    } catch (error) {
      console.error("Failed to send audio file:", error);
      Alert.alert("Error", "Failed to send audio file. Please try again.");
    } finally {
      setLoading(false);
      setShowPromptPanel(false);
    }
  };

  const handleSendMessage = async () => {
    if (numberOfMessagesLeft >= 0) {
      setLoading(true);
      updateNumberOfMessages();

      try {
        if (threadID) {
          setLoadingUpdateMessage("Generating a reply ...");
          const response = await sendMessageWithVoiceReply(threadID, messages, inputMessage);


          const audioUrl = response.audioUrl;


          setLoadingUpdateMessage("Generated a Response");
          setLoading(false);

          if (showPromptPanel) {
            setShowPromptPanel(false);
          }
          if (user.autoSpeak == true || user.autoSpeak == undefined) {
            // Assuming you want to play the newly received message
            setPlayingMessageIndex(messages.length); // Adjust based on how you manage indices
            setPlayingSound();
            await playSpeech(
              audioUrl,
              messages.length + 1, // Assuming this is how you calculate the index
              playingMessageIndex,
              setPlayingMessageIndex,
              setPlayingSound,
              setIsSoundLoading
            );
          }
        } else {
          Alert.alert(
            "No conversation started",
            "Please start a conversation by clicking the microphone button, if the problem persists please contact support.",
            [
              {
                text: "OK",
                onPress: () => console.log("OK Pressed"),
                style: "cancel",
              },
            ],
            { cancelable: false }
          );
        }
      } catch (error) {
        console.error("Error in sending message", error);
        setLoading(false);
      }
    }
    setInputMessage(""); // Clear input field after sending
    setLoading(false);
  };


  const handleSpeechInput = async () => {
    if (user?.numberOfMessages >= 0) {
      if (!threadID) {
        await startThread().then(async () => {
          if (recording) {
            stopRecording();
          } else {
            startRecording();
            updateNumberOfMessages();
          }
        });
      } else {
        if (recording) {
          stopRecording();
        } else {
          startRecording();
          updateNumberOfMessages();
        }
      }
    } else {
      router.push("/store");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={
        Platform.OS === "ios" ? (isKeyBoardInFocus ? 95 : 0) : 0
      } // Adjust the value here
      style={{ flex: 1, justifyContent: "center", backgroundColor: "#ffffff" }}
    >
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor:
              showPromptPanel && !loading
                ? colorsDark.mainBackground
                : colorsDark.secondary,
          },
          title: "Home",
          headerBackVisible: false,
          headerLeft: () => {
            return (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <RoundButton
                  icon={
                    showPromptPanel || !threadID ? (
                      <Ionicons
                        name="flame-sharp"
                        size={20}
                        color={colorsDark.orange}
                      />
                    ) : (
                      <Ionicons name="pencil-outline" size={20} color="grey" />
                    )
                  }
                  size={35}
                  color={
                    showPromptPanel || !threadID
                      ? "#FFFFFF00"
                      : colorsDark.white
                  }
                  disabled={loading}
                  onPress={async () => {
                    setShowPromptPanel(true);
                    dispatch(setMessagesRedux([]));
                    dispatch(setThreadID(""));
                    setMessages([]);
                    // dispatch(setIsCurrentChatALesson(false));
                  }}
                />
                <Text
                  style={{ color: "white", fontWeight: "bold", marginLeft: 2 }}
                >
                  {!threadID ? user.streak : "New Convo"}
                </Text>
              </View>
            );
          },

          headerRight: () => {
            return (
              <View style={styles.headerRightView}>
                {showPromptPanel ? (
                  <>
                    <RoundButton
                      icon={
                        <FontAwesome5
                          name="store-alt"
                          size={20}
                          color="white"
                        />
                      }
                      size={40}
                      color={"#FFFFFF00"}
                      onPress={() => {
                        router.push("/store");
                      }}
                    />
                    <RoundButton
                      icon={
                        <Ionicons name="cog-outline" size={30} color="white" />
                      }
                      size={40}
                      color={"#FFFFFF00"}
                      onPress={() => {
                        router.push("/settings");
                      }}
                    />
                  </>
                ) : (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    <RoundButton
                      icon={
                        <Ionicons name="chatbubble" size={30} color="white" />
                      }
                      size={40}
                      color={"#FFFFFF00"}
                      onPress={() => {
                        router.push("/store");
                      }}
                    />
                    <Text
                      style={{
                        color: colorsDark.green,
                        position: "absolute",
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      {user?.numberOfMessages}
                    </Text>
                  </View>
                )}
              </View>
            );
          },
        }}
      />
      <View
        style={[
          styles.container,
          {
            width: "100%",
            backgroundColor: showPromptPanel
              ? colorsDark.secondary
              : colorsDark.mainBackground,
          },
        ]}
      >
        <StatusBar barStyle="light-content" />
        <MessageModal
          visible={modalVisible}
          setModalVisible={setModalVisible}
        />

        <View style={styles.messageContainer}>
          {!loading && user?.language ? (
            showPromptPanel ? (
              <PromptSuggestionCard
                loading={loading}
                recording={recording}
                handleSpeechInput={handleSpeechInput}
                startThread={startThread}
                language={user?.language ? user.language : "language"}
                setShowPromptPanel={setShowPromptPanel} handleSendMessage={handleSendMessage}
                setLoading={setLoading}
                user={user}
              />
            ) : (
              <MessageThread
                isUsingAssistant={isUsingAssistant}
                isSoundLoading={isSoundLoading}
                setIsSoundLoading={setIsSoundLoading}
                playingSound={playingSound}
                setPlayingSound={setPlayingSound}
                playingMessageIndex={playingMessageIndex}
                setPlayingMessageIndex={setPlayingMessageIndex}
                setModalVisible={setModalVisible}
              />
            )
          ) : (
            <View
              style={
                {
                  // flex: 1,
                  // justifyContent: "center",f
                  // alignItems: "center",
                }
              }
            >
              <LoadingComponent textUpdateState={loadingUpdateMessage} />
            </View>
          )}
        </View>
        {!showPromptPanel ? (
          <BlurView
            style={{
              flexDirection: "row",
              flex: 0.1,
              // backgroundColor: colorsDark.mainBackground,
              paddingTop: 10,
              paddingBottom: 10,
              paddingHorizontal: 15,
              justifyContent: "space-around",
              width: "100%",
              borderEndEndRadius: 20,
              // height: 10,
              position: "absolute",
              bottom: 0,
            }}
            intensity={50}
            tint={"dark"}
          >
            <RoundButton
              icon={
                <MaterialCommunityIcons
                  name="microphone-outline"
                  size={24}
                  color="white"
                />
              }
              size={50}
              color={recording ? "red" : colorsDark.blue}
              onPress={handleSpeechInput}
              disabled={loading}
            />
            <InputBox
              onChangeText={(text) => setInputMessage(text)}
              value={inputMessage}
              placeholder={`Type a message`}
              editable={!loading}
              width={"60%"}
              height={50}
              borderRadius={25}
              onFocus={() => {
                setIsKeyBoardInFocus(true);
              }}
            />

            <RoundButton
              icon={
                <Ionicons name="paper-plane-outline" size={20} color="white" />
              }
              size={50}
              onPress={async () => {
                if (numberOfMessagesLeft >= 0) {
                  try {
                    handleSendMessage(messages, null, inputMessage?.trim());
                  } catch (error) {
                    console.error("Error in onPress:", error);
                  }
                } else {
                  router.push("/store");
                }
              }}
              disabled={loading || inputMessage?.trim().length === 0}
            />
          </BlurView>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorsDark.secondary,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  messageContainer: {
    flex: 1,
    // padding: 15,
  },

  messageText: {
    color: "#333",
  },
  headerRightView: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: 100,
  },
});
