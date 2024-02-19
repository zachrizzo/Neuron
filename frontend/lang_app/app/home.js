import React, { useEffect, useState } from "react";
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
  setMessages,
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

export default function App() {
  const [inputMessage, setInputMessage] = useState("");
  // const [threadID, setThreadId] = useState("");
  const [localMessages, setLocalMessages] = useState([]);
  const [speechSound, setSpeechSound] = useState();
  const [recording, setRecording] = useState();
  const [loading, setLoading] = useState(false);
  const [isUsingAssistant, setIsUsingAssistant] = useState(false);
  const [showPromptPanel, setShowPromptPanel] = useState(true);
  const user = useSelector(selectUser);
  const [playingSound, setPlayingSound] = useState();
  const [playingMessageIndex, setPlayingMessageIndex] = useState(null);
  const [isSoundLoading, setIsSoundLoading] = useState(false);
  const threadID = useSelector(selectThreadID);
  const messages = useSelector(selectMessages);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [startingPrompt, setStartingPrompt] = useState(
    mainChatPrompt(user?.language)
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

  useEffect(() => {
    if (messages.length > 0) {
      setLocalMessages(messages);
    }
  }, [messages]);

  useEffect(() => {
    if (!user) return;

    const calculateTimeDifferenceInHours = (startDate, endDate) => {
      const msInHour = 1000 * 60 * 60;
      return (endDate.getTime() - startDate.getTime()) / msInHour;
    };
    const lastMessageRefill = new Date(user.lastMessageRefill);
    const now = new Date();
    const diffInHours = calculateTimeDifferenceInHours(lastMessageRefill, now);

    if (diffInHours > 24) {
      const updatedData = {
        numberOfMessages: 50,
        lastMessageRefill: now.toISOString() ? now.toISOString() : now,
      };

      dispatch(setUserNumberOfMessages(updatedData.numberOfMessages));
      dispatch(
        setUserNumberOfMessagesLastRefill(updatedData.lastMessageRefill)
      );
      console.log("updatedData", updatedData);

      updateUser(auth.currentUser.email, updatedData)
        .then(() => console.log("User updated successfully"))
        .catch((error) => console.error("Error updating user:", error));
    }
  }, [user, user?.lastMessageRefill]);

  useEffect(() => {
    // Assume `user` contains user data including streak count and last visit date
    if (!user) return;

    const now = new Date();
    const lastVisitDate = user.lastVisit ? new Date(user.lastVisit) : null;
    const oneDayInMs = 1000 * 60 * 60 * 24;
    const twoDaysInMs = 1000 * 60 * 60 * 24 * 2;
    let newStreak = user.streak || 0;

    // Check if the user has visited within the last 48 hours but more than 24 hours
    if (
      lastVisitDate &&
      now - lastVisitDate < twoDaysInMs &&
      now - lastVisitDate > oneDayInMs
    ) {
      // Increment streak
      newStreak++;
    } else {
      // Reset streak if it's been more than 48 hours or less than 24 hours
      newStreak = 1;
    }

    // Update user data
    const updatedUserData = {
      ...user,
      streak: newStreak,
      lastVisit: now.toISOString(),
    };

    // Update user in Firebase and Redux
    updateUser(auth.currentUser.email, updatedUserData)
      .then(() => {
        console.log("Streak updated successfully");
        dispatch(setUser(updatedUserData));
      })
      .catch((error) => console.error("Error updating streak:", error));
  }, []);

  //update user in redux from firebase
  useEffect(() => {
    getUser(auth.currentUser.email).then((user) => {
      dispatch(setUser(user.data()));
      // console.log("user updated from firebase", user.data());
    });
  }, [auth.currentUser]);

  useEffect(() => {
    if (!user || user.hearts >= 10) return;

    const calculateTimeDifferenceInHours = (startDate, endDate) => {
      const msInHour = 1000 * 60 * 60;
      return (endDate.getTime() - startDate.getTime()) / msInHour;
    };

    const lastHeartRefill = new Date(user.heartsLastRefill);
    const now = new Date();
    const diffInHours = calculateTimeDifferenceInHours(lastHeartRefill, now);

    if (diffInHours > 24) {
      const updatedData = {
        hearts: 10,
        heartsLastRefill: now.toISOString(),
      };

      updateUser(auth.currentUser.email, updatedData)
        .then(() => {
          console.log("Hearts refilled successfully");
          dispatch(setUserHearts({ hearts: 10 }));
          dispatch(setUserHeartsLastRefill({ heartsLastRefill: now }));
        })
        .catch((error) => console.error("Error refilling hearts:", error));
    }
  }, [user, user?.heartsLastRefill]);

  useEffect(() => {
    //if prompt panel is showing stop playing
    if (showPromptPanel) {
      stopPlaying(playingSound, setPlayingSound, setPlayingMessageIndex);
    }
  }, [showPromptPanel]);

  useEffect(() => {
    if (threadID && messages.length > 2) {
      {
        setShowPromptPanel(false);
      }
    }
  }, [threadID]);

  const updateNumberOfMessages = async () => {
    dispatch(
      setUserNumberOfMessages({ numberOfMessages: numberOfMessagesLeft - 1 })
    );
    updateUser(auth.currentUser.email, {
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

        setLocalMessages([systemMessage]);
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
        console.log("Requesting permissions..");
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        console.log("Starting recording..");
        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(recording);
        console.log("Recording started");
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

  async function stopRecording() {
    setLoading(true);

    try {
      console.log("Stopping recording..");
      setRecording(undefined);
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      const uri = recording.getURI();

      const formData = new FormData();
      formData.append("file", {
        uri: uri,
        type: "audio/m4a", // or the correct type of your audio file
        name: "audiofile.m4a",
      });
      setLoadingUpdateMessage("Transcribing your message...");

      const transcribedText = await transcribeAudio(
        formData,
        selectLang(user?.language)
      );
      console.log("Transcribed text:", transcribedText);
      const userMessage = {
        id: `user${messages?.length}`,
        createdAt: new Date().toLocaleString(),
        text: { role: "user", content: transcribedText },
        type: "sent",
      };

      dispatch(pushSingleMessage(userMessage));
      setLocalMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, userMessage];
        handleSendMessage(updatedMessages, uri, transcribedText);
        return updatedMessages;
      });
      setLoadingUpdateMessage("Transcribed your message...");

      console.log("Sending message...");

      // await handleSendMessage(transcribedText, uri);

      // Use the transcribed text as needed
    } catch (error) {
      console.error("Error in getting transcribed text", error);
      Alert.alert(
        "Error transcribing audio",
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
  }

  const handleSendMessage = async (
    messagesArray,
    userRecording,
    userMessage,
    model_type = "general_lang_chat"
  ) => {
    if (numberOfMessagesLeft >= 0) {
      setLoading(true);
      setInputMessage(""); // Clear input field after sending
      updateNumberOfMessages();
      if (isUsingAssistant) {
        // try {
        //   if (threadID.length > 0) {
        //     const response = await addMessageWithVoiceReply(threadID, {
        //       content: message,
        //     });
        //     const messagesData = response.messages;
        //     const audioUrl = response.audio_url;
        //     // Combine existing messages with new messages
        //     const updatedMessages = messages.concat(
        //       messagesData.map((msg, index) => {
        //         let audioUrlForMessage = ""; // Initialize with no URL
        //         // Assign the audio URL to the last message of the new data
        //         if (index === messagesData.length - 1) {
        //           audioUrlForMessage = audioUrl;
        //         }
        //         return {
        //           id: msg.id,
        //           createdAt: new Date(msg.created_at * 1000).toLocaleString(),
        //           text: msg.content,
        //           type: msg.role === "user" ? "sent" : "received",
        //           audioUrl: audioUrlForMessage,
        //         };
        //       })
        //     );
        //     setMessages(updatedMessages);
        //     // Play the audio response
        //     if (audioUrl) {
        //       const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
        //       setSpeechSound(sound);
        //       await sound.playAsync();
        //     }
        //   }
        // } catch (error) {
        //   console.error("Error in sending message", error);
        // }
      } else {
        try {
          if (threadID) {
            setLoadingUpdateMessage("Generating a reply ...");
            const openAIFormatMessages = messagesArray.map((msg) => ({
              role: msg.text.role,
              content: msg.text.content,
            }));

            const response = await addMessageWithVoiceReplyNoAssistant({
              conversation: openAIFormatMessages,
              model_type: model_type,
            });
            const messagesData = response.messages;

            const audioUrl = response.audio_url;
            setLoadingUpdateMessage("Generated a Response");

            const assistantReply = {
              id: messagesData[messagesData.length - 1].id,
              createdAt: new Date().toLocaleString(),
              text: messagesData[messagesData.length - 1],
              type:
                messagesData[messagesData.length - 1].role == "user"
                  ? "sent"
                  : "received",
              audioUrl: audioUrl,
            };

            dispatch(pushSingleMessage(assistantReply));

            setLocalMessages([...localMessages, assistantReply]); // Update the state with the new array
            setLoading(false);
            if (showPromptPanel === true) {
              setShowPromptPanel(false);
            }
            if (user.autoSpeak == true || user.autoSpeak == undefined) {
              setPlayingMessageIndex(messagesData.length - 2);
              setPlayingSound();
              await playSpeech(
                audioUrl,
                messagesData.length,
                playingMessageIndex,
                setPlayingMessageIndex,
                setPlayingSound,
                setIsSoundLoading
              );
            }

            let userAudioUri = "";

            if (userRecording) {
              userAudioUri = await uploadAudioFile(userRecording, threadID);
            }
            //add user message
            if (userMessage?.trim().length > 0) {
              await addMessageToChat(threadID, {
                createdAt: new Date().toLocaleString(),
                text: { role: "user", content: userMessage },
                type: "sent",
                id: `user${messages.length - 1}`,
                audioUrl: userAudioUri,
              });
            }
            //add assistant message
            await addMessageToChat(threadID, {
              createdAt: new Date().toLocaleString(),
              id: messagesData[messagesData.length - 1].id,
              text: {
                content: messagesData[messagesData.length - 1].content,
                role: messagesData[messagesData.length - 1].role,
              },
              type:
                messagesData[messagesData.length - 1].role === "user"
                  ? "sent"
                  : "received",
              audioUrl: audioUrl,
            });
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
      setLoading(false);
    }
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
                    dispatch(setMessages([]));
                    dispatch(setThreadID(""));
                    setLocalMessages([]);
                    dispatch(setIsCurrentChatALesson(false));
                    setThreadID("");
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
                setShowPromptPanel={setShowPromptPanel}
                setStartingPrompt={setStartingPrompt}
                handleSendMessage={handleSendMessage}
                setLoading={setLoading}
                user={user}
              />
            ) : (
              <MessageThread
                messages={messages}
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
                    const userMessage = {
                      id: `user${messages?.length}`,
                      createdAt: new Date().toLocaleString(),
                      text: { role: "user", content: inputMessage },
                      type: "sent",
                    };
                    dispatch(pushSingleMessage(userMessage));
                    setLocalMessages((prevMessages) => {
                      const updatedMessages = [...prevMessages, userMessage];
                      handleSendMessage(
                        updatedMessages,
                        null,
                        inputMessage?.trim()
                      );

                      return updatedMessages;
                    });
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
