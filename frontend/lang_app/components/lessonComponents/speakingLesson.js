import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import RoundButton from "../buttons/roundButtons";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/userSlice";
import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
} from "@react-native-voice/voice";
import { PermissionsAndroid } from "react-native";
import { playSpeech } from "../../helperFunctions/audioHelpers";
import { TextInput } from "react-native-gesture-handler";
import { colorsDark } from "../../utility/color";
import SelectableText from "../text/selectableText";
import FluencyCalculator from "../../helperFunctions/fluency";

// 00008130-000415DE1E30001C
const SpeakingLesson = ({
  text,
  translationText,
  audioUrl,
  setIsCorrect,
  setFluencyScore,
  fluencyScore,
  taskDescription,
  gender,
}) => {
  const [recording, setRecording] = useState(false);
  const user = useSelector(selectUser);
  const lang = user?.language;
  const [recognizedSpeech, setRecognizedSpeech] = useState();
  const [partialRecognizedSpeech, setPartialRecognizedSpeech] = useState();
  const [volume, setVolume] = useState(0);
  const [playingSound, setPlayingSound] = useState();
  const [isSoundLoading, setIsSoundLoading] = useState(false);
  const [lastSpokenText, setLastSpokenText] = useState("");
  const [volumeTimer, setVolumeTimer] = useState(null);

  const [volumeHistory, setVolumeHistory] = useState([]);

  const volumeInterval = 1; //milliseconds

  // Create an instance of FluencyCalculator
  const fluencyCalculator = new FluencyCalculator(volumeInterval);

  // Normalize text and remove punctuation
  const normalizeText = (inputText) => {
    return inputText?.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\_`~()?]/g, "");
  };

  // Function to render text with highlighted recognized words
  const renderTextWithHighlight = (text, recognizedWordsSet) => {
    return text.split(" ").map((word, index) => {
      const cleanWord = normalizeText(word);
      const isRecognized = recognizedWordsSet.has(cleanWord);
      return (
        <Text
          key={index}
          style={isRecognized ? styles.recognizedWord : styles.normalWord}
        >
          {word + (index < text.split(" ").length - 1 ? " " : "")}
        </Text>
      );
    });
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
  // console.log("combinedSpeech: ", combinedSpeech);

  useEffect(() => {
    // Function to clean text for comparison
    const cleanTextForComparison = (text) => {
      return text
        .toLowerCase()
        .replace(/\(.*?\)/g, "") // Remove text within parentheses
        .replace(/[.,\/#!$%\^&\*;:{}=\_`~()?]/g, "") // Remove specified punctuation
        .split(" ") // Split into words
        .filter(Boolean); // Remove any empty strings
    };

    // Clean the expected text, recognized speech, and partial recognized speech
    const cleanedTextWords = new Set(cleanTextForComparison(text));
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

    // Proceed only if there's recognized or partially recognized speech
    if ((recognizedSpeech || partialRecognizedSpeech) && allWordsPresent) {
      setIsCorrect(true); // All expected words are present in the recognized speech
      console.log("All words are present, regardless of order. Correct!");

      // Calculate the fluency score
      const newFluencyScore = fluencyCalculator.calculateFluency(
        recognizedSpeech,
        partialRecognizedSpeech,
        text,
        volumeHistory
      );
      console.log(`Fluency score: ${newFluencyScore}`);
      setFluencyScore(newFluencyScore);
    }

    // Reset volume and volume history for the next attempt
    setVolume(0);
    setVolumeHistory([]);
  }, [recognizedSpeech, partialRecognizedSpeech, text]);

  useEffect(() => {
    // Only proceed if both text and audioUrl are available
    if (text && audioUrl) {
      // Reset states for new text
      setRecognizedSpeech("");
      setPartialRecognizedSpeech("");
      setLastSpokenText(text);

      // Play speech for new text
      const play = async () => {
        await playSpeech(
          audioUrl,
          1,
          null,
          null,
          setPlayingSound,
          setIsSoundLoading
        );
      };

      play();
    }
  }, [text, audioUrl]); // Depend on both text and audioUrl

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

    if (recording) {
      startVolumeRecording();
    } else {
      stopVolumeRecording();
    }

    return () => {
      stopVolumeRecording();
    };
  }, [recording, volume]);

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

  const onSpeechStart = (e) => {
    // console.log("onSpeechStart: ", e);
  };

  const onSpeechRecognized = (e) => {
    // console.log("onSpeechRecognized: ", e);
  };

  const onSpeechEnd = (e) => {
    // console.log("onSpeechEnd: ", e);
  };

  const onSpeechError = (e) => {
    // console.log("onSpeechError: ", e);
  };

  const onSpeechResults = (e) => {
    console.log("onSpeechResults: ", e);
    setRecognizedSpeech(e.value[0]);
  };

  const onSpeechPartialResults = (e) => {
    console.log("onSpeechPartialResults: ", e);
    setPartialRecognizedSpeech(e.value[0]);
  };

  const onSpeechVolumeChanged = (e) => {
    setVolume(e.value);
    // setVolumeHistory((currentHistory) => [...currentHistory, e.value]);
    console.log("onSpeechVolumeChanged: ", e);
  };

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

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.taskDescriptionText}>{taskDescription}</Text>

      <View style={styles.textView}>
        <SelectableText
          style={styles.text}
          text={renderTextWithHighlight(text, normalizedCombinedSpeech)}
        />

        <Text style={styles.translationText}>{translationText}</Text>
      </View>
      {audioUrl && (
        <RoundButton
          color={"#FFFFFF00"}
          loading={isSoundLoading}
          pulse={!isSoundLoading}
          disabled={volume > 0}
          icon={
            <AntDesign
              name="sound"
              size={25}
              color={playingSound ? colorsDark.disabledGrey : colorsDark.white}
            />
          }
          size={40}
          marginRight={5}
          onPress={async () => {
            if (playingSound) {
              await stopPlaying(
                playingSound,
                setPlayingSound,
                setPlayingMessageIndex
              );
              return;
            } else {
              await playSpeech(
                audioUrl,
                1,
                null,
                null,
                setPlayingSound,
                setIsSoundLoading
              );
            }
          }}
        />
      )}

      <RoundButton
        icon={
          <MaterialCommunityIcons
            name="microphone-outline"
            size={24}
            color="white"
          />
        }
        volume={volume}
        disabled={playingSound}
        size={70}
        marginVertical={50}
        color={recording ? colorsDark.red : colorsDark.blue}
        onPress={async () => {
          if (!playingSound) {
            if (
              Platform.OS === "android" &&
              !(await requestMicrophonePermission())
            ) {
              console.log("Microphone permission denied");
              return;
            }

            if (recording) {
              await Voice.stop();
              setRecording(false);
              setVolume(0);
              setRecognizedSpeech("");
              setPartialRecognizedSpeech("");
              setFluencyScore(0);
            } else {
              try {
                await Voice.start("fr-FR");
                setRecording(true);
                console.log("Started recording");
              } catch (e) {
                console.error("Error starting voice recognition: ", e);
              }
            }
          }
        }}
      />
    </View>
  );
};

export default SpeakingLesson;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
    justifyContent: "space-between",
  },
  textView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },

  text: {
    color: colorsDark.white,
    fontSize: 25,
    textAlign: "center",
    marginHorizontal: 12,
  },
  recognizedWord: {
    color: colorsDark.green,
    fontSize: 45, // You can adjust the font size
  },
  normalWord: {
    color: colorsDark.white,
    fontSize: 45, // You can adjust the font size
  },
  translationText: {
    color: colorsDark.secondaryTextGrey,
    fontSize: 20,
    marginTop: 20,
    marginBottom: 100,
  },
  taskDescriptionText: {
    color: colorsDark.blue,
    marginTop: 20,
    marginHorizontal: 40,
    fontSize: 18,
    fontStyle: "italic",
  },
});
