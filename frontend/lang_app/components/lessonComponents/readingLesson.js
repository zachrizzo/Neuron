import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import MainButton from "../buttons/mainButton";
import { colorsDark } from "../../utility/color";
import { TextInput } from "react-native-gesture-handler";

const ReadingLesson = ({
  text,
  translationText,
  audioUrl,
  setMissedQuestions,
  setIsCorrect,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [wordChoices, setWordChoices] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array) => {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  useEffect(() => {
    // Randomly decide to show text or translation
    if (Math.random() < 0.5) {
      setDisplayedText(text);
      setWordChoices(shuffleArray(translationText.split(" ")));
    } else {
      setDisplayedText(translationText);
      setWordChoices(shuffleArray(text.split(" ")));
    }
  }, [text, translationText]);

  const handleWordSelection = (word) => {
    setSelectedWords([...selectedWords, word]);
    // Remove the selected word from wordChoices
    setWordChoices(wordChoices.filter((w) => w !== word));
  };

  const handleSelectedWordTap = (index) => {
    // Remove the word from selectedWords and put it back in wordChoices
    let newSelectedWords = [...selectedWords];
    newSelectedWords.splice(index, 1);
    setSelectedWords(newSelectedWords);
    setWordChoices([...wordChoices, selectedWords[index]]);
  };
  const checkTranslation = () => {
    const userTranslation = selectedWords.join(" ");
    if (displayedText === text && userTranslation === translationText) {
      setIsCorrect(true);
    } else if (displayedText === translationText && userTranslation === text) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
      setMissedQuestions((questions) => [...questions, displayedText]);
    }
    setSelectedWords([]);
  };

  return (
    <View style={styles.container}>
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
            style={styles.wordButton}
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
    backgroundColor: "#FFF",
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
});
