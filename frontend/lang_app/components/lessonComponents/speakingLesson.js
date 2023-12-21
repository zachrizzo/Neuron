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
// 00008130-000415DE1E30001C
const SpeakingLesson = ({
  text,
  translationText,
  audioUrl,
  setMissedQuestions,
  setIsCorrect,
  setFluencyScore,
  fluencyScore,
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

  const [volumeHistory, setVolumeHistory] = useState([]);
  // const [fluencyScore, setFluencyScore] = useState(0);

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
      const newFluencyScore = calculateFluency(
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
          null,
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
    setVolumeHistory((currentHistory) => [...currentHistory, e.value]);
    console.log("onSpeechVolumeChanged: ", e);
  };
  const calculateFluency = (
    recognizedSpeech,
    partialRecognizedSpeech,
    expectedText,
    volumeHistory,
    volumeThreshold = 1.5
  ) => {
    // Normalize and split texts into words
    const normalize = (text) =>
      text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\_`~()?]/g, "");
    const expectedWords = normalize(expectedText).split(" ");
    const recognizedWords = normalize(recognizedSpeech || "").split(" ");
    const partialWords = normalize(partialRecognizedSpeech || "").split(" ");

    // Calculate word accuracy
    const recognizedWordSet = new Set(recognizedWords.concat(partialWords));
    const expectedWordSet = new Set(expectedWords);

    // Calculate number of correct words, regardless of order
    const correctWords = Array.from(recognizedWordSet).filter((word) =>
      expectedWordSet.has(word)
    ).length;
    const wordAccuracy = correctWords / expectedWords.length;

    // Calculate order metric more accurately
    let correctOrderScore = 0;
    let recognizedWordsInOrder = recognizedWords
      .concat(partialWords)
      .filter((word) => expectedWordSet.has(word));
    for (let i = 0; i < recognizedWordsInOrder.length; i++) {
      if (recognizedWordsInOrder[i] === expectedWords[i]) {
        correctOrderScore++;
      }
    }
    const orderMetric = correctOrderScore / expectedWords.length;

    // Trim volumeHistory to start from the first instance of speaking
    const startIndex = volumeHistory.findIndex(
      (volume) => volume >= volumeThreshold
    );
    const trimmedVolumeHistory =
      startIndex !== -1 ? volumeHistory.slice(startIndex) : [];

    // Improved speech continuity calculation using trimmedVolumeHistory
    let totalMoments = trimmedVolumeHistory.length;
    let speakingMoments = trimmedVolumeHistory.filter(
      (volume) => volume >= volumeThreshold
    ).length;
    const speechContinuity =
      totalMoments > 0 ? speakingMoments / totalMoments : 0;

    // Calculate edit distance for a rough measure of overall accuracy
    const editDistance = getEditDistance(
      normalize(recognizedSpeech || ""),
      normalize(expectedText)
    );
    const editDistanceScore =
      (expectedText.length - editDistance) / expectedText.length;

    // Combine metrics into a fluency score
    const fluencyScore =
      (wordAccuracy + speechContinuity + orderMetric + editDistanceScore) / 4;
    console.log("wordAccuracy: ", wordAccuracy);
    console.log("speechContinuity: ", speechContinuity);
    console.log("orderMetric: ", orderMetric);
    console.log("editDistanceScore: ", editDistanceScore);
    console.log("fluencyScore: ", fluencyScore);
    // Convert the score to a percentage
    const fluencyPercentage = Math.round(fluencyScore * 100);
    return fluencyPercentage <= 100 ? fluencyPercentage : 100;
  };

  // Placeholder function for edit distance (Levenshtein Distance)
  function getEditDistance(a, b) {
    // Implementation of the Levenshtein distance
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    let matrix = [];

    // Increment along the first column of each row
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    // Increment each column in the first row
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            Math.min(
              matrix[i][j - 1] + 1, // insertion
              matrix[i - 1][j] + 1
            )
          ); // deletion
        }
      }
    }

    return matrix[b.length][a.length];
  }

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
          disabled={volume > 0}
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
        disabled={playingSound}
        size={70}
        color={recording ? "red" : "#007bff"}
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
