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
} from "react-native";
import {
  createThread,
  createMessage,
  runAssistant,
  generateReply,
  textToSpeech,
  transcribeAudio,
} from "./api/messaging/assistant";
import MainButton from "./components/buttons/mainButton";
import InputBox from "./components/inputs/inputBox";
import RoundButton from "./components/buttons/roundButtons";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function App() {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [threadId, setThreadId] = useState("");
  const [sentMessages, setSentMessages] = useState([]);
  const [messageLoadingStatus, setMessageLoadingStatus] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [speechSound, setSpeechSound] = useState();
  const [recording, setRecording] = useState();
  const [isRecording, setIsRecording] = useState(false);

  const startThread = async () => {
    // Step 1: Create a thread
    const threadData = await createThread();
    setThreadId(threadData.thread_id);
  };

  useEffect(() => {
    const fetchAndSetMessages = async () => {
      if (messageLoadingStatus === "completed") {
        const replyData = await generateReply(threadId);
        setMessages(
          replyData.map((data) => ({
            id: data.id,
            createdAt: data.created_at,
            text: data.content[0].text.value,
            type: data.role === "user" ? "sent" : "received",
          }))
        );

        // Play the last message from the response
        if (
          replyData.length > 0 &&
          replyData[0].content.length > 0 &&
          threadId.length > 0
        ) {
          const lastMessageText = replyData[0].content[0].text.value;
          await playSpeech(lastMessageText);
        }

        setSentMessages([]);
        setMessageLoadingStatus("");
      }
    };

    fetchAndSetMessages();
  }, [messageLoadingStatus, threadId, refresh]);

  useEffect(() => {
    return speechSound
      ? () => {
          console.log("Unloading Sound");
          speechSound.unloadAsync();
        }
      : undefined;
  }, [speechSound]);

  async function startRecording() {
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
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);

    const formData = new FormData();
    formData.append("file", {
      uri: uri,
      type: "audio/m4a", // or the correct type of your audio file
      name: "audiofile.m4a",
    });

    try {
      const transcribedText = await transcribeAudio(formData);
      console.log("Transcribed text:", transcribedText);

      await handleSendMessage(transcribedText);

      // Use the transcribed text as needed
    } catch (error) {
      console.error("Error in getting transcribed text", error);
    }
  }

  const playSpeech = async (text) => {
    try {
      const audioUrl = await textToSpeech(text);
      console.log("Playing sound", audioUrl);
      const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });

      setSpeechSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing speech", error);
    }
  };
  const handleSendMessage = async (message) => {
    try {
      await createMessage(threadId, message);
      setSentMessages((prev) => [...prev, message]);
      setInputMessage(""); // Clear input field after sending

      const messageStatus = await runAssistant(
        threadId,
        "reply short and sweet"
      );
      setMessageLoadingStatus(messageStatus);
    } catch (error) {
      console.error("Error in sending message", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, justifyContent: "center", backgroundColor: "black" }}
    >
      <SafeAreaView
        style={[styles.container, { width: "100%", backgroundColor: "black" }]}
      >
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "black",
            width: "100%",
            flex: 0.07,
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <RoundButton
            icon={<Ionicons name="pencil-outline" size={20} color="grey" />}
            size={40}
            color="white"
            onPress={() => {
              setMessages([]);
              setThreadId("");
              startThread();
            }}
          />
          <Text style={{ color: "white", marginHorizontal: 20 }}>
            {!threadId.length > 0 ? "New Conversation " : "let's talk"}
          </Text>
        </View>
        <View style={styles.messageContainer}>
          <FlatList
            data={messages}
            style={styles.messageList}
            renderItem={({ item }) => (
              <View
                style={
                  item.type === "sent"
                    ? styles.sentMessage
                    : styles.receivedMessage
                }
              >
                <Text
                  style={
                    item.type === "sent"
                      ? styles.sentMessageText
                      : styles.receivedMessageText
                  }
                >
                  {item.text}
                </Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            inverted
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            flex: 0.1,
          }}
        >
          <RoundButton
            icon={
              <MaterialCommunityIcons name="waveform" size={24} color="white" />
            }
            size={40}
            disabled={recording}
            onPress={recording ? stopRecording : startRecording}
            marginRight={10}
          />
          <InputBox
            onChangeText={(text) => setInputMessage(text)}
            value={inputMessage}
            placeholder="Type a message"
          />

          <RoundButton
            icon={
              <Ionicons name="paper-plane-outline" size={20} color="white" />
            }
            size={40}
            onPress={() => {
              handleSendMessage(inputMessage);
            }}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  messageContainer: {
    flex: 0.97,
    padding: 15,
  },
  messageLabel: {
    fontWeight: "bold",
  },
  receivedMessageText: {
    color: "white",
    marginBottom: 10,
  },
  sentMessageText: {
    color: "#fff",
    marginBottom: 10,
  },
  messageList: {
    width: "100%",
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007BFF",
    borderRadius: 20,
    padding: 10,
    margin: 5,
    marginLeft: 30,
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF68",
    borderRadius: 20,
    padding: 10,
    margin: 5,
    marginRight: 30,
  },
  messageText: {
    color: "#333",
  },
});
