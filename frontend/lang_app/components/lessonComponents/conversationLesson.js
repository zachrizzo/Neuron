import React, { useState, useEffect, useCallback, useMemo } from "react";
import { StyleSheet, Text, View, FlatList, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import RoundButton from "../buttons/roundButtons";
import { playSpeech, stopPlaying } from "../../helperFunctions/audioHelpers";
import { colorsDark } from "../../utility/color";
import SelectableText from "../text/selectableText";
import DividerLine from "../layout/dividerLine";
import { useSelector } from "react-redux";
import Voice from "@react-native-voice/voice";
import FluencyCalculator from "../../helperFunctions/fluency";
import { selectUser } from "../../redux/slices/userSlice";

const ConversationLesson = ({
  taskDescription,
  conversationSteps,
  setFluencyScore,
  setIsCorrect,
}) => {
  const user = useSelector(selectUser);
  const lang = user?.language;
  const [playingSound, setPlayingSound] = useState(null);
  const [isSoundLoading, setIsSoundLoading] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isResponseVisible, setIsResponseVisible] = useState(false);
  const [speechResults, setSpeechResults] = useState("");
  const [volume, setVolume] = useState(0);
  const [volumeHistory, setVolumeHistory] = useState([]);
  const [partialRecognizedSpeech, setPartialRecognizedSpeech] = useState();
  const [recognizedSpeech, setRecognizedSpeech] = useState();
  const [currentExpectedResponse, setCurrentExpectedResponse] = useState("");
  const [totalFluencyScore, setTotalFluencyScore] = useState(0);
  const [numberOfFluencyScores, setNumberOfFluencyScores] = useState(1);
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [IsLastMessageOfConvo, setIsLastMessageOfConvo] = useState(false);
  const [speechFinished, setSpeechFinished] = useState(false);
  const [volumeTimer, setVolumeTimer] = useState(null);

  const volumeInterval = 1;

  // Create an instance of FluencyCalculator
  const fluencyCalculator = new FluencyCalculator(volumeInterval);

  // Normalize text and remove punctuation
  const normalizeText = (inputText) => {
    return inputText?.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\_`~()?]/g, "");
  };

  const cleanTextForComparison = (text) => {
    return text
      .toLowerCase()
      .replace(/\(.*?\)/g, "") // Remove text within parentheses
      .replace(/[.,\/#!$%\^&\*;:{}=\_`~()?]/g, "") // Remove specified punctuation
      .split(" ") // Split into words
      .filter(Boolean); // Remove any empty strings
  };

  // Clean the expected text, recognized speech, and partial recognized speech
  const cleanedTextWords = new Set(
    cleanTextForComparison(currentExpectedResponse)
  );
  const recognizedWords = new Set(
    cleanTextForComparison(recognizedSpeech || "")
  );
  const partialWords = new Set(
    cleanTextForComparison(partialRecognizedSpeech || "")
  );

  // Check if all words in the cleaned text are present in the recognized or partial words
  const allWordsPresent = [...cleanedTextWords].every(
    (word) => recognizedWords.has(word) || partialWords.has(word)
  );

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    // Function to start the volume recording at regular intervals
    const startVolumeRecording = () => {
      const timer = setInterval(() => {
        setVolumeHistory((currentHistory) => [...currentHistory, volume]);
      }, volumeInterval); // Adjust the interval as needed (1000ms = 1 second)
      setVolumeTimer(timer);
    };

    // Function to stop the volume recording
    const stopVolumeRecording = () => {
      if (volumeTimer) {
        clearInterval(volumeTimer);
        setVolumeTimer(null);
      }
    };

    if (isRecording) {
      startVolumeRecording();
    } else {
      stopVolumeRecording();
    }

    return () => {
      stopVolumeRecording();
    };
  }, [isRecording, volume]);

  const renderTextWithHighlight = (text, recognizedWordsSet, messageIndex) => {
    const isWholeMessageRecognized =
      visibleMessages[messageIndex]?.isResponseSpeechCorrect;

    if (isWholeMessageRecognized) {
      return (
        <Text key={messageIndex} style={styles.recognizedWord}>
          {text}
        </Text>
      );
    } else {
      return text.split(" ").map((word, index) => {
        const cleanWord = normalizeText(word);
        const isRecognized = recognizedWordsSet.has(cleanWord);

        return (
          <Text
            key={`${messageIndex}-${index}`}
            style={isRecognized ? styles.recognizedWord : styles.messageText}
          >
            {word + (index < text.split(" ").length - 1 ? " " : "")}
          </Text>
        );
      });
    }
  };

  useEffect(() => {
    // Initialize the visible messages with the first step
    setVisibleMessages((prevMessages) => [
      ...prevMessages,
      {
        convo: conversationSteps[0],
        showResponse: false,
        isResponseSpeechCorrect: false,
      },
    ]);
    // Play the first audio file on render
    playStepAudio(conversationSteps[0].audioFilePathQuestion);
  }, []);

  //get metadata from audio file
  //   const getAudioMetadata = async (audioUrl) => {
  //     const metadata = await getAudioMetadataAsync(audioUrl);
  //     console.log("metadata: ", metadata);

  const playStepAudio = async (audioUrl) => {
    // setIsResponseVisible(false);
    if (playingSound) {
      await stopPlaying(playingSound, setPlayingSound, setPlayingMessageIndex);
    }
    await playSpeech(
      audioUrl,
      1,
      null,
      null,
      setPlayingSound,
      setIsSoundLoading
    );
    //get metadata from audio file
    console.log("-----------------------------");

    // Reveal the response after the audio is done playing
    setTimeout(() => {
      setIsResponseVisible(true);

      //update the last step showResponse to true
      setVisibleMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1].showResponse = true;

        updatedMessages[
          updatedMessages.length - 1
        ].isResponseSpeechCorrect = false;
        return updatedMessages;
      });
    }, 1000); // Adjust this delay based on the audio duration
  };

  const onSpeechResults = (e) => {
    // console.log("User said: ", e.value);
    setSpeechResults(e.value[0]);
    // setIsRecording(false);
  };

  const onSpeechStart = (e) => {
    // console.log("onSpeechStart: ", e);
  };

  const onSpeechRecognized = (e) => {
    // console.log("onSpeechRecognized: ", e);
  };

  const onSpeechEnd = (e) => {
    // console.log("onSpeechEnd: ", e);
    setSpeechFinished(!speechFinished);
  };

  const onSpeechError = (e) => {
    // console.log("onSpeechError: ", e);
  };

  const onSpeechVolumeChanged = (e) => {
    setVolume(e.value);
    setVolumeHistory((currentHistory) => [...currentHistory, e.value]);
    // console.log("onSpeechVolumeChanged: ", e);
  };
  const onSpeechPartialResults = (e) => {
    // console.log("onSpeechPartialResults: ", e);
    try {
      setPartialRecognizedSpeech(e.value[0]);
    } catch (error) {
      console.log(error);
    }
  };

  // Combine recognized and partial recognized speech and remove duplicates
  const combinedSpeech = new Set([
    ...(recognizedSpeech || "").toLowerCase().split(" "),
    ...(partialRecognizedSpeech || "").toLowerCase().split(" "),
  ]);

  // Remove empty strings and normalize
  const normalizedCombinedSpeech = new Set(
    Array.from(combinedSpeech).filter(Boolean).map(normalizeText)
  );

  useEffect(() => {
    if ((recognizedWords || partialWords) && allWordsPresent) {
      Voice.stop();
      console.log("stopped  recording");
      setIsRecording(false);
    }
  }, [recognizedSpeech, partialRecognizedSpeech, volumeHistory]);

  useEffect(() => {
    if (
      (recognizedWords || partialWords) &&
      allWordsPresent &&
      speechFinished
    ) {
      const newFluencyScore = fluencyCalculator.calculateFluency(
        recognizedSpeech,
        partialRecognizedSpeech,
        currentExpectedResponse,
        volumeHistory
      );

      //   console.log(`Fluency score: ${newFluencyScore}`);
      setTotalFluencyScore(totalFluencyScore + newFluencyScore);
      setNumberOfFluencyScores(numberOfFluencyScores + 1);
      setVisibleMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1].showResponse = true;
        //set the last message to correct speaking
        updatedMessages[
          updatedMessages.length - 1
        ].isResponseSpeechCorrect = true;
        return updatedMessages;
      });
      // Voice.stop();
      setRecognizedSpeech("");
      setPartialRecognizedSpeech("");
      setSpeechResults("");
      // setIsRecording(false);
      setVolume(0);
      setVolumeHistory([]);

      if (currentStepIndex < conversationSteps.length - 1) {
        console.log("currentStepIndex has been increased");
        setVisibleMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[currentStepIndex].showResponse = true;
          //set the last message to correct speaking
          updatedMessages[currentStepIndex].isResponseSpeechCorrect = true;
          return updatedMessages;
        });
        //Add the next step to the visible messages
        setVisibleMessages((prevMessages) => [
          ...prevMessages,
          {
            convo: conversationSteps[currentStepIndex + 1],
            showResponse: false,
            isResponseSpeechCorrect: false,
          },
        ]);
        playStepAudio(
          conversationSteps[currentStepIndex + 1].audioFilePathQuestion
        );
        setCurrentStepIndex(currentStepIndex + 1);
        setIsResponseVisible(false);
        console.log("currentStepIndex has been increased");
      } else {
        console.log("All steps have been completed");
        // Calculate average fluency score
        console.log(`Fluency score: ${newFluencyScore}`);
        setTotalFluencyScore(totalFluencyScore + newFluencyScore);
        setNumberOfFluencyScores(numberOfFluencyScores + 1);
        const averageFluencyScore = totalFluencyScore / numberOfFluencyScores;
        setFluencyScore(`${averageFluencyScore}`);
        setIsRecording(false);
        setIsCorrect(true);
        setIsLastMessageOfConvo(true);
      }
    }
  }, [speechFinished, isRecording]);

  const requestMicrophonePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: "Microphone Permission",
          message:
            "This app needs access to your microphone for speech recognition.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const renderItem = useCallback(
    ({ item, index }) => {
      if (index > currentStepIndex) {
        return null;
      }

      showTheResponse = item.showResponse;

      //check what step is the current step
      if (index === currentStepIndex && showTheResponse) {
        setCurrentExpectedResponse(item.convo.expectedResponse);
      }

      return (
        <View>
          <View style={styles.messageBubbleLeft}>
            <View>
              <SelectableText
                style={styles.messageText}
                text={item.convo.question}
              />
              <Text
                style={[
                  styles.messageTextTranslation,
                  { color: colorsDark.secondaryTextGrey },
                ]}
              >
                {item.convo.questionTranlation}
              </Text>
            </View>
            <RoundButton
              icon={
                <MaterialCommunityIcons name="play" size={20} color="white" />
              }
              color={colorsDark.blue}
              size={30}
              onPress={() => playStepAudio(item.convo.audioFilePathQuestion)}
            />
          </View>

          {item.convo.expectedResponse && showTheResponse && (
            <View style={styles.messageBubbleRight}>
              <View>
                <SelectableText
                  style={styles.messageText}
                  // text={item.expectedResponse}
                  text={renderTextWithHighlight(
                    item.convo.expectedResponse,
                    normalizedCombinedSpeech,
                    index
                  )}
                />
                <Text
                  style={[
                    styles.messageTextTranslation,
                    { color: colorsDark.secondaryText },
                  ]}
                >
                  {item.convo.responseTranslation}
                </Text>
              </View>
              <RoundButton
                icon={
                  <MaterialCommunityIcons name="play" size={20} color="white" />
                }
                color={colorsDark.green}
                size={30}
                onPress={() =>
                  playSpeech(
                    item.convo.audioFilePathResponse,
                    1,
                    null,
                    null,
                    setPlayingSound,
                    setIsSoundLoading
                  )
                }
              />
            </View>
          )}
        </View>
      );
    },
    [currentStepIndex, normalizedCombinedSpeech, playStepAudio]
  );

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.taskDescriptionText}>{taskDescription}</Text>
        <DividerLine color={"#FFFFFF5E"} marginVertical={30} />
        <FlatList
          data={visibleMessages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          style={{ width: "100%" }}
        />

        {isResponseVisible && (
          <RoundButton
            icon={
              <MaterialCommunityIcons
                name="microphone-outline"
                size={24}
                color="white"
              />
            }
            volume={isRecording ? volume : 0}
            disabled={playingSound}
            size={70}
            marginVertical={60}
            color={isRecording ? colorsDark.red : colorsDark.blue}
            onPress={async () => {
              if (!playingSound) {
                if (
                  Platform.OS === "android" &&
                  !(await requestMicrophonePermission())
                ) {
                  console.log("Microphone permission denied");
                  return;
                }

                if (isRecording) {
                  await Voice.stop();
                  setIsRecording(false);
                  console.log("Stopped recording");
                  // setVolume(0);
                  // setRecognizedSpeech("");
                  // setPartialRecognizedSpeech("");
                  // setFluencyScore(0);
                } else {
                  try {
                    await Voice.start("fr-FR");
                    setIsRecording(true);
                    console.log("Started recording");
                  } catch (e) {
                    console.error("Error starting voice recognition: ", e);
                  }
                }
              } else {
                console.log("audio is playing");
              }
            }}
          />
        )}
      </View>
    </View>
  );
};

export default ConversationLesson;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorsDark.mainBackground,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  taskDescriptionText: {
    color: colorsDark.blue,
    fontSize: 18,
    fontStyle: "italic",
    marginBottom: 20,
    textAlign: "center",
  },
  messageBubbleLeft: {
    backgroundColor: colorsDark.accent,
    borderRadius: 20,
    padding: 10,
    margin: 10,
    marginLeft: 20,
    marginRight: 100,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  messageBubbleRight: {
    backgroundColor: colorsDark.blue,
    borderRadius: 20,
    padding: 10,
    margin: 10,
    marginLeft: 100,
    marginRight: 20,
    alignSelf: "flex-end",

    flexDirection: "row",
    alignItems: "center",
  },
  messageText: {
    color: "white",
    fontSize: 16,
    marginRight: 10,
  },
  messageTextTranslation: {
    marginTop: 15,
    fontSize: 12,
    fontStyle: "italic",
  },
  recognizedWord: {
    color: colorsDark.green,
    fontWeight: "bold",
  },
});
