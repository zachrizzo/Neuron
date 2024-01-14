import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import { colorsDark } from "../../utility/color";
import * as Haptics from "expo-haptics";

const VocabLesson = ({
  taskDescription,
  options,
  targetLanguage,
  setIsCorrect,
}) => {
  const [targetPhrases, setTargetPhrases] = useState([]);
  const [englishPhrases, setEnglishPhrases] = useState([]);
  const [selectedTargetPhrase, setSelectedTargetPhrase] = useState(null);
  const [selectedEnglishPhrase, setSelectedEnglishPhrase] = useState(null);
  const [correctMatches, setCorrectMatches] = useState([]);
  const [incorrectMatch, setIncorrectMatch] = useState(false);
  // Timer related states and constants
  const totalTime = 60; // Total time in seconds
  const [timeLeft, setTimeLeft] = useState(totalTime);

  useEffect(() => {
    setTargetPhrases(shuffleArray([...options[targetLanguage]]));
    setEnglishPhrases(shuffleArray([...options.English]));

    // Start the timer
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer); // Clear timer on unmount
  }, [options, targetLanguage]);

  // Timer effect to handle countdown and completion
  useEffect(() => {
    if (
      timeLeft === 0 ||
      correctMatches.length === options[targetLanguage].length
    ) {
      clearInterval(timeLeft); // Stop the timer
      setIsCorrect(correctMatches.length === options[targetLanguage].length);
    }
  }, [timeLeft, correctMatches, options, targetLanguage, setIsCorrect]);

  useEffect(() => {
    setTargetPhrases(shuffleArray([...options[targetLanguage]]));
    setEnglishPhrases(shuffleArray([...options.English]));
  }, [options, targetLanguage]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };

  const handleSelectTargetPhrase = (phrase) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTargetPhrase(phrase);
    setIncorrectMatch(false);
    if (selectedEnglishPhrase) {
      checkMatch(phrase, selectedEnglishPhrase);
    }
  };

  const handleSelectEnglish = (phrase) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedEnglishPhrase(phrase);
    setIncorrectMatch(false);
    if (selectedTargetPhrase) {
      checkMatch(selectedTargetPhrase, phrase);
    }
  };

  const checkMatch = (targetPhrase, englishPhrase) => {
    const targetIndex = options[targetLanguage].indexOf(targetPhrase);
    const englishIndex = options.English.indexOf(englishPhrase);

    if (targetIndex === englishIndex) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCorrectMatches([...correctMatches, targetPhrase]);
      // Alert.alert("Correct!", "You've made a correct match.", [{ text: "OK" }]);
      setSelectedTargetPhrase(null);
      setSelectedEnglishPhrase(null);
    } else {
      // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setIncorrectMatch(true);
      setTimeout(() => {
        setIncorrectMatch(false);
        setSelectedTargetPhrase(null);
        setSelectedEnglishPhrase(null);
      }, 1000); // Reset after 1 second
    }
  };

  const getPhraseButtonStyle = (phrase, isTargetLanguage) => {
    const isPhraseCorrect = correctMatches.includes(phrase);
    const isSelected = isTargetLanguage
      ? selectedTargetPhrase === phrase
      : selectedEnglishPhrase === phrase;

    // Check if the corresponding phrase in the other language is correct
    const correspondingPhrase = isTargetLanguage
      ? options.English[options[targetLanguage].indexOf(phrase)]
      : options[targetLanguage][options.English.indexOf(phrase)];
    const isCorrespondingPhraseCorrect =
      correctMatches.includes(correspondingPhrase);

    if (isPhraseCorrect || isCorrespondingPhraseCorrect) {
      return styles.phraseButtonCorrect;
    }
    if (incorrectMatch && isSelected) {
      return styles.phraseButtonIncorrect;
    }
    if (isSelected) {
      return styles.phraseButtonSelected;
    }
    return styles.phraseButton;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={getPhraseButtonStyle(item, true)}
      onPress={() => handleSelectTargetPhrase(item)}
      disabled={correctMatches.includes(item)}
    >
      <Text style={{ color: colorsDark.white }}>{item}</Text>
    </TouchableOpacity>
  );

  const renderEnglishItem = ({ item }) => (
    <TouchableOpacity
      style={getPhraseButtonStyle(item, false)}
      onPress={() => handleSelectEnglish(item)}
      disabled={correctMatches.includes(
        options[targetLanguage][options.English.indexOf(item)]
      )}
    >
      <Text style={{ color: colorsDark.white }}>{item}</Text>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <Text style={styles.taskDescriptionText}>{taskDescription}</Text>
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{timeLeft}s</Text>
      </View>
      <View style={styles.phraseListsContainer}>
        <FlatList
          data={targetPhrases}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          style={styles.phraseList}
        />
        <FlatList
          data={englishPhrases}
          renderItem={renderEnglishItem}
          keyExtractor={(item, index) => index.toString()}
          style={styles.phraseList}
        />
      </View>
    </View>
  );
};

export default VocabLesson;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  taskDescriptionText: {
    color: colorsDark.blue,
    fontSize: 18,
    fontStyle: "italic",
    marginBottom: 30,
    textAlign: "center",
  },
  phraseListsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  phraseList: {
    flex: 1,
  },
  phraseButton: {
    backgroundColor: colorsDark.accent,
    color: colorsDark.white,
    padding: 10,
    paddingVertical: 15,
    margin: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  phraseButtonText: {
    fontSize: 16,
  },
  phraseButtonSelected: {
    backgroundColor: colorsDark.blue,
    padding: 10,
    paddingVertical: 15,

    margin: 5,
    borderRadius: 10,
    alignItems: "center",
    color: colorsDark.white,
  },
  phraseButtonCorrect: {
    backgroundColor: colorsDark.green,
    padding: 10,
    paddingVertical: 15,

    margin: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  phraseButtonIncorrect: {
    backgroundColor: colorsDark.red,
    padding: 10,
    paddingVertical: 15,

    margin: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  timerContainer: {
    position: "absolute",
    top: 50,
    right: 10,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 5,
  },
  timerText: {
    color: colorsDark.red,
    fontSize: 16,
  },
});
