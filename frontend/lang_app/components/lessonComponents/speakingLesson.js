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

const SpeakingLesson = ({
  text,
  translationText,
  audioUrl,
  setMissedQuestions,
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
  const [isCorrect, setIsCorrect] = useState(false);
  const [volumeHistory, setVolumeHistory] = useState([]);
  const [fluencyScore, setFluencyScore] = useState(0);

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
  console.log("combinedSpeech: ", combinedSpeech);

  useEffect(() => {
    // Remove parentheses and text within them, and then all specified punctuation except hyphen
    const removePunctuationAndParentheses = (text) => {
      return text
        .replace(/\(.*?\)/g, "")
        .replace(/[.,\/#!$%^&*;:{}=_`~?]/g, "");
    };

    const cleanedText = removePunctuationAndParentheses(text);
    console.log("text: ", cleanedText);

    const cleanedSpeech = recognizedSpeech
      ? removePunctuationAndParentheses(recognizedSpeech)
      : "";
    const cleanedPartialSpeech = partialRecognizedSpeech
      ? removePunctuationAndParentheses(partialRecognizedSpeech)
      : "";

    console.log("speech: ", cleanedSpeech);
    console.log("partialSpeech: ", cleanedPartialSpeech);

    if (
      combinedSpeech.has(cleanedText) ||
      cleanedSpeech === cleanedText ||
      (cleanedPartialSpeech === cleanedText && fluencyScore < 1)
    ) {
      // User completed the task and got it correct
      setRecording(false);
      Voice.stop();
      setIsCorrect(true);
      console.log("Correct");

      // Now use the volumeHistory to calculate fluency
      const fluencyScore = calculateFluency(
        recognizedSpeech,
        partialRecognizedSpeech,
        text,
        volumeHistory
      );
      console.log(`Fluency Score: ${fluencyScore}`);

      // Reset states
      setVolume(0);
      setVolumeHistory([]);
      if (fluencyScore) {
        setFluencyScore(fluencyScore);
      }
    }
  }, [recognizedSpeech, partialRecognizedSpeech, text]);

  useEffect(() => {
    // if (lastSpokenText !== text) {
    setRecognizedSpeech("");
    setPartialRecognizedSpeech("");
    return async () => {
      await playSpeech(
        audioUrl,
        null,
        null,
        null,
        setPlayingSound,
        setIsSoundLoading
      );
      setLastSpokenText(text);
    };
    // }
  }, [text]);

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
    console.log("onSpeechStart: ", e);
  };

  const onSpeechRecognized = (e) => {
    console.log("onSpeechRecognized: ", e);
  };

  const onSpeechEnd = (e) => {
    console.log("onSpeechEnd: ", e);
  };

  const onSpeechError = (e) => {
    console.log("onSpeechError: ", e);
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
    setVolumeHistory((currentHistory) => [...currentHistory, e.value]);
    console.log("onSpeechVolumeChanged: ", e);
  };

  const calculateFluency = (
    recognizedSpeech,
    partialRecognizedSpeech,
    expectedText,
    volumeHistory,
    volumeThreshold = 1.5 // Define a suitable threshold for your volume data
  ) => {
    // Normalize and split texts into words
    const normalize = (text) =>
      text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\_`~()?]/g, "");
    const expectedWords = normalize(expectedText).split(" ");
    const recognizedWords = normalize(recognizedSpeech || "").split(" ");
    const partialWords = normalize(partialRecognizedSpeech || "").split(" ");

    // Calculate word accuracy
    const correctWords = recognizedWords.filter((word) =>
      expectedWords.includes(word)
    ).length;
    const wordAccuracy = correctWords / expectedWords.length;

    // Estimate pauses based on volume, starting after the first speech
    let hasStartedSpeaking = false;
    let pauses = 0;
    let speakingMoments = 0;
    volumeHistory.forEach((volume) => {
      if (volume >= volumeThreshold) {
        hasStartedSpeaking = true;
        speakingMoments++;
      } else if (hasStartedSpeaking) {
        pauses++;
      }
    });

    // Calculate speech continuity as the ratio of speaking moments to total moments
    const speechContinuity = speakingMoments / (speakingMoments + pauses);
    console.log(`Speech continuity: ${speechContinuity}`);
    console.log(`Word accuracy: ${wordAccuracy}`);
    // Combine metrics into a fluency score
    const fluencyScore = (wordAccuracy + speechContinuity) / 2;
    return fluencyScore;
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
      <View style={styles.textView}>
        <TextInput
          multiline={true}
          scrollEnabled={false}
          editable={false}
          style={styles.text}
        >
          {renderTextWithHighlight(text, normalizedCombinedSpeech)}
        </TextInput>
        <Text style={styles.translationText}>{translationText}</Text>
      </View>
      {audioUrl && (
        <RoundButton
          color={"#FFFFFF00"}
          loading={isSoundLoading}
          pulse={!isSoundLoading}
          icon={
            <AntDesign
              name="sound"
              size={25}
              color={playingSound ? "#FFFFFF91" : "#FFFFFF"}
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
                null,
                null,
                null,
                setPlayingSound,
                setIsSoundLoading
              );
            }
          }}
        />
      )}
      <Text style={{ color: "#FFFFFF", fontSize: 20 }}>{fluencyScore}</Text>
      <RoundButton
        icon={
          <MaterialCommunityIcons
            name="microphone-outline"
            size={24}
            color="white"
          />
        }
        volume={volume}
        size={70}
        color={recording ? "red" : "#007bff"}
        onPress={async () => {
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
        }}
      />
    </View>
  );
};

export default SpeakingLesson;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#000000",
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
    color: "#FFFFFF",
    fontSize: 50,
    textAlign: "center",
    marginHorizontal: 20,
  },
  recognizedWord: {
    color: "green",
    fontSize: 50, // You can adjust the font size
  },
  normalWord: {
    color: "#FFFFFF",
    fontSize: 50, // You can adjust the font size
  },
  translationText: {
    color: "#CCCCCCC3",
    fontSize: 25,
    marginTop: 20,
    marginBottom: 100,
  },
});
