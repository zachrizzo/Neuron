import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MainButton from "../buttons/mainButton";
import { colorsDark } from "../../utility/color";
import { playSpeech, stopPlaying } from "../../helperFunctions/audioHelpers";
import { BlurView } from "expo-blur";
import RoundButton from "../buttons/roundButtons";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

const sanitizeWord = (word) => {
  return word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").toLowerCase();
};

const ListeningLesson = ({
  translation,
  text,
  taskDescription,
  options,
  audioUrl,
  setIsCorrect,
  setGivenAnswer,
  setCorrectAnswer,
}) => {
  const [playingSound, setPlayingSound] = useState(null);
  const [isSoundLoading, setIsSoundLoading] = useState(false);
  const [selectedWords, setSelectedWords] = useState([]);
  const [wordChoices, setWordChoices] = useState([]);
  const [blurValue, setBlurValue] = useState(25);
  useEffect(() => {
    const translationWords = translation.split(" ").map(sanitizeWord);
    const optionsWords = options.English.flatMap((phrase) =>
      phrase.split(" ").map(sanitizeWord)
    );

    const combinedWords = [...new Set([...translationWords, ...optionsWords])];

    // Preserve the order and duplication of words in the translation
    const finalWords = translationWords.concat(
      combinedWords.filter((word) => !translationWords.includes(word))
    );

    const shuffledWords = finalWords.sort(() => 0.5 - Math.random());

    setWordChoices(shuffledWords);
    setCorrectAnswer(translation.toLowerCase());
    playAudio();
  }, [translation, options]);

  const handleWordSelection = (word, index) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const selection = { word, index };
    if (!selectedWords.some((sw) => sw.word === word && sw.index === index)) {
      setSelectedWords([...selectedWords, selection]);
    }
  };

  const handleSelectedWordTap = (index) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    let newSelectedWords = [...selectedWords];
    newSelectedWords.splice(index, 1);
    setSelectedWords(newSelectedWords);
  };

  const playAudio = async () => {
    if (playingSound) {
      await stopPlaying(playingSound, setPlayingSound);
    }
    await playSpeech(
      audioUrl,
      1,
      null,
      null,
      setPlayingSound,
      setIsSoundLoading
    );
  };

  const checkTranslation = () => {
    // Construct an array from the selected words and sanitize them
    const userTranslationArray = selectedWords.map(({ word }) =>
      sanitizeWord(word)
    );

    // Sanitize and split the correct translation into an array
    const correctTranslationArray = translation.split(" ").map(sanitizeWord);

    // Check if arrays are equal in length and content
    const isCorrect =
      userTranslationArray.length === correctTranslationArray.length &&
      userTranslationArray.every(
        (word, index) => word === correctTranslationArray[index]
      );

    setIsCorrect(isCorrect);
    if (!isCorrect) {
      setGivenAnswer(userTranslationArray.join(" "));
    }

    setSelectedWords([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.taskDescriptionText}>{taskDescription}</Text>
      <View style={styles.audioTextContainer}>
        <View
          style={{
            flex: 0.5,
            alignItems: "flex-start",
            flexDirection: "row",
            // backgroundColor: "red",
            justifyContent: "center",
          }}
        >
          <RoundButton
            color={"#FFFFFF00"}
            loading={isSoundLoading}
            pulse={!isSoundLoading}
            disabled={isSoundLoading}
            icon={
              <AntDesign
                name="sound"
                size={25}
                color={
                  playingSound ? colorsDark.disabledGrey : colorsDark.white
                }
              />
            }
            size={40}
            //   margin={30}
            onPress={async () => {
              if (playingSound) {
                await stopPlaying(playingSound, setPlayingSound);
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
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 0.5,
            flexDirection: "row",
            // backgroundColor: "red",
            padding: 10,
          }}
        >
          <RoundButton
            onPress={() => {
              if (blurValue === 25) {
                setBlurValue(0);
              } else {
                setBlurValue(25);
              }
            }}
            icon={
              <Feather
                name={blurValue === 25 ? "eye-off" : "eye"}
                size={20}
                color={colorsDark.white}
              />
            }
            color={"#FFFFFF00"}
            size={30}
          />

          <View style={styles.textContainer}>
            <Text style={styles.blurredText}>{text}</Text>
            <BlurView
              style={styles.overlayBlur}
              intensity={blurValue}
              tint="dark"
            />
          </View>
        </View>
      </View>
      <View style={styles.selectedWords}>
        {selectedWords.map(({ word, index }) => (
          <TouchableOpacity
            key={`${word}-${index}`}
            style={styles.selectedWordButton}
            onPress={() => handleSelectedWordTap(word, index)}
          >
            <Text style={styles.selectedWordButtonText}>{word}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.wordChoices}>
        {wordChoices.map((word, index) => (
          <TouchableOpacity
            key={`${word}-${index}`}
            style={
              selectedWords.some((sw) => sw.word === word && sw.index === index)
                ? styles.wordButtonSelected
                : styles.wordButton
            }
            onPress={() => handleWordSelection(word, index)}
          >
            <Text style={styles.wordButtonText}>{word}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <MainButton
        onPress={checkTranslation}
        title={"Check"}
        backgroundColor={colorsDark.blue}
        margin={30}
      />
    </View>
  );
};

export default ListeningLesson;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // width: Dimensions.get("screen").width,
  },
  text: {
    color: "white",
    fontSize: 30,
    marginBottom: 20,
  },
  wordChoices: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },

  wordButton: {
    backgroundColor: colorsDark.white,
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },

  wordButtonSelected: {
    backgroundColor: colorsDark.oldBackgroundColor,
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },

  wordButtonText: {
    color: "#000",
    fontSize: 16,
  },
  checkButton: {
    backgroundColor: "#28A745",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  checkButtonText: {
    color: "#FFF",
    fontSize: 18,
  },
  selectedWords: {
    backgroundColor: colorsDark.secondary,
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 20,
    padding: 10,
    width: Dimensions.get("screen").width - 30,
    minHeight: 100,
    borderRadius: 20,
    // Add borders around each selected word box
    // borderWidth: 1,sq
    // borderColor: "#DDD", // Light grey border color for overall box
  },
  selectedWordButton: {
    backgroundColor: colorsDark.accent,
    padding: 10,
    margin: 2,
    borderRadius: 5,
  },
  selectedWordButtonText: {
    color: "#FFF",
    fontSize: 16,
  },

  textContainer: {
    flex: 0.8, // Allow the text container to fill the remaining space
    borderRadius: 20,
    overflow: "hidden",
    // alignItems: "center",
    backgroundColor: colorsDark.secondary,
    width: "100%",
    padding: 10,
  },
  blurredText: {
    color: "white",
    fontSize: 20,
  },
  overlayBlur: {
    ...StyleSheet.absoluteFillObject,
    // Ensure the blur view covers the text
  },
  taskDescriptionText: {
    color: colorsDark.blue,
    marginTop: 20,
    marginHorizontal: 40,
    fontSize: 15,
    fontStyle: "italic",
    textAlign: "center",
  },
  audioTextContainer: {
    // flexDirection: "row",
    alignItems: "center",
    // backgroundColor: colorsDark.secondary,
    justifyContent: "center",
    width: "100%",
    flex: 1,
    marginVertical: 20,
  },
});
