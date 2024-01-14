import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import MainButton from "../buttons/mainButton";
import { colorsDark } from "../../utility/color";
import { TextInput } from "react-native-gesture-handler";
import { removePunctuation } from "../../helperFunctions/helper";
import * as Haptics from "expo-haptics";

const ReadingLesson = ({
  text,
  translationText,
  taskDescription,
  audioUrl,
  setIsCorrect,
  translationOptions,
  setGivenAnswer,
  setCorrectAnswer,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [wordChoices, setWordChoices] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);

  useEffect(() => {
    // Determine the language of the displayed text and set word choices accordingly
    // Determine the language of the displayed text and set word choices accordingly
    if (Math.random() < 0.5) {
      setDisplayedText(text);
      setWordChoices(shuffleArray(translationOptions.English)); // Shuffle English options
      setCorrectAnswer(translationText);
    } else {
      setDisplayedText(translationText);
      setWordChoices(shuffleArray(translationOptions.French)); // Shuffle French options
      setCorrectAnswer(text);
    }
  }, [text, translationText, translationOptions]);

  const handleWordSelection = (word) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedWords([...selectedWords, word]);
  };

  const handleSelectedWordTap = (index) => {
    let newSelectedWords = [...selectedWords];
    newSelectedWords.splice(index, 1);
    setSelectedWords(newSelectedWords);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  const shuffleArray = (array) => {
    let shuffled = array.slice(); // Copy the array
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Random index
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }
    return shuffled;
  };

  const checkTranslation = () => {
    // Concatenate selected words and remove punctuation for user's translation
    const userTranslation = removePunctuation(
      selectedWords.join(" ").toLowerCase()
    );

    // Determine the correct translation based on the displayed text and remove punctuation
    const correctTranslation = removePunctuation(
      displayedText === text
        ? translationText.toLowerCase()
        : text.toLowerCase()
    );

    // Check if the user's translation matches the correct translation
    if (userTranslation === correctTranslation) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
      setGivenAnswer(userTranslation);
    }
    setSelectedWords([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.taskDescriptionText}>{taskDescription}</Text>
      <TextInput
        multiline={true}
        scrollEnabled={false}
        editable={false}
        style={styles.text}
      >
        {displayedText}
      </TextInput>
      <View style={styles.selectedWords}>
        {selectedWords.map((word, index) => (
          <TouchableOpacity
            key={index}
            style={styles.selectedWordButton}
            onPress={() => handleSelectedWordTap(index)}
          >
            <Text style={styles.selectedWordButtonText}>{word}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.wordChoices}>
        {wordChoices.map((word, index) => (
          <TouchableOpacity
            key={index}
            style={
              selectedWords.includes(word)
                ? styles.wordButtonSelected
                : styles.wordButton
            }
            onPress={() => handleWordSelection(word)}
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

export default ReadingLesson;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    marginBottom: 10,
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
  taskDescriptionText: {
    color: colorsDark.blue,
    marginVertical: 20,
    marginHorizontal: 40,
    fontSize: 18,
    fontStyle: "italic",
    textAlign: "center",
  },
});
