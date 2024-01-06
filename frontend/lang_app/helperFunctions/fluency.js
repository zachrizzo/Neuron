class FluencyCalculator {
  constructor(interval) {
    this.volumeThreshold = 1.5;
    this.interval = interval; // Interval in milliseconds
  }

  normalizeText(text) {
    console.log("normalizeText:", text);
    if (typeof text === "string") {
      return text
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\_`~()?]/g, "")
        .split(" ")
        .filter(Boolean);
    }
    return [];
  }

  allWordsPresent(expectedText, recognizedSpeech, partialRecognizedSpeech) {
    const cleanTextForComparison = (text) => {
      console.log("cleanTextForComparison:", text);
      return text
        ?.toLowerCase()
        .replace(/\(.*?\)/g, "")
        .replace(/[.,\/#!$%\^&\*;:{}=\_`~()?]/g, "")
        .split(" ")
        .filter(Boolean);
    };

    const cleanedTextWords = new Set(cleanTextForComparison(expectedText));
    const recognizedWords = new Set(
      cleanTextForComparison(recognizedSpeech || "")
    );
    const partialWords = new Set(
      cleanTextForComparison(partialRecognizedSpeech || "")
    );

    return [...cleanedTextWords].every(
      (word) => recognizedWords.has(word) || partialWords.has(word)
    );
  }

  calculateFluency(
    recognizedSpeech,
    partialRecognizedSpeech,
    expectedText,
    volumeHistory
  ) {
    console.log(
      "calculateFluency:",
      recognizedSpeech,
      partialRecognizedSpeech,
      expectedText,
      volumeHistory
    );

    const expectedWords = this.normalizeText(expectedText);
    const recognizedWords = this.normalizeText(recognizedSpeech);
    const partialWords = this.normalizeText(partialRecognizedSpeech);

    // Combine recognized and partial words for fluency calculation
    const combinedWords =
      recognizedWords.length > partialWords.length
        ? recognizedWords
        : partialWords;
    const recognizedWordSet = new Set(combinedWords);
    const expectedWordSet = new Set(expectedWords);

    const correctWords = Array.from(recognizedWordSet).filter((word) =>
      expectedWordSet.has(word)
    ).length;
    const wordAccuracy =
      expectedWords.length > 0 ? correctWords / expectedWords.length : 0;

    let correctOrderScore = 0;
    combinedWords.forEach((word, index) => {
      if (word === expectedWords[index]) {
        correctOrderScore++;
      }
    });
    const orderMetric =
      expectedWords.length > 0 ? correctOrderScore / expectedWords.length : 0;

    // Existing code to find the effective start and end indices
    const startIndex = volumeHistory.findIndex(
      (volume) => volume >= this.volumeThreshold
    );
    const effectiveStartIndex = startIndex === -1 ? 0 : startIndex;
    const reversedIndex = [...volumeHistory]
      .reverse()
      .findIndex((volume) => volume >= this.volumeThreshold);
    const endIndex =
      reversedIndex === -1
        ? volumeHistory.length - 1
        : volumeHistory.length - 1 - reversedIndex;
    const trimmedVolumeHistory = volumeHistory.slice(
      effectiveStartIndex,
      endIndex + 1
    );

    // Calculate the total duration and speaking duration using the interval
    let totalDurationMs = trimmedVolumeHistory.length * this.interval;
    let speakingDurationMs =
      trimmedVolumeHistory.filter((volume) => volume >= this.volumeThreshold)
        .length * this.interval;

    // Calculate speech continuity based on duration
    const speechContinuity =
      totalDurationMs > 0 ? speakingDurationMs / totalDurationMs : 0;

    const editDistance = this.getEditDistance(combinedWords, expectedWords);
    const maxDistance = Math.max(expectedWords.length, combinedWords.length);
    const editDistanceScore =
      expectedWords.length > 0
        ? 1 - Math.min(editDistance, maxDistance) / maxDistance
        : 0;

    const fluencyScore =
      (wordAccuracy + speechContinuity + orderMetric + editDistanceScore) / 4;

    console.log(
      "Fluency Calculation:",
      "wordAccuracy:",
      wordAccuracy,
      "speechContinuity:",
      speechContinuity,
      "orderMetric:",
      orderMetric,
      "editDistanceScore:",
      editDistanceScore
    );

    return Math.max(0, Math.min(Math.round(fluencyScore * 100), 100));
  }
  getEditDistance(aWords, bWords) {
    console.log("getEditDistance:", aWords, bWords);
    if (aWords.length === 0) return bWords.length;
    if (bWords.length === 0) return aWords.length;

    let matrix = [];

    // Initialize the first column of the matrix
    for (let i = 0; i <= bWords.length; i++) {
      matrix[i] = [i];
    }
    // Initialize the first row of the matrix
    for (let j = 0; j <= aWords.length; j++) {
      matrix[0][j] = j;
    }

    // Compute the edit distance between the two arrays of words
    for (let i = 1; i <= bWords.length; i++) {
      for (let j = 1; j <= aWords.length; j++) {
        if (bWords[i - 1] === aWords[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // Substitution
            Math.min(
              matrix[i][j - 1] + 1, // Insertion
              matrix[i - 1][j] + 1 // Deletion
            )
          );
        }
      }
    }

    return matrix[bWords.length][aWords.length];
  }
}

export default FluencyCalculator;

/////old
// const calculateFluency = (
//   recognizedSpeech,
//   partialRecognizedSpeech,
//   expectedText,
//   volumeHistory,
//   volumeThreshold = 1.5
// ) => {
//   // Normalize and split texts into words
//   const normalize = (text) =>
//     text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\_`~()?]/g, "");
//   const expectedWords = normalize(expectedText).split(" ");
//   const recognizedWords = normalize(recognizedSpeech || "").split(" ");
//   const partialWords = normalize(partialRecognizedSpeech || "").split(" ");

//   // Calculate word accuracy
//   const recognizedWordSet = new Set(recognizedWords.concat(partialWords));
//   const expectedWordSet = new Set(expectedWords);

//   // Calculate number of correct words, regardless of order
//   const correctWords = Array.from(recognizedWordSet).filter((word) =>
//     expectedWordSet.has(word)
//   ).length;
//   const wordAccuracy = correctWords / expectedWords.length;

//   // Calculate order metric more accurately
//   let correctOrderScore = 0;
//   let recognizedWordsInOrder = recognizedWords
//     .concat(partialWords)
//     .filter((word) => expectedWordSet.has(word));
//   for (let i = 0; i < recognizedWordsInOrder.length; i++) {
//     if (recognizedWordsInOrder[i] === expectedWords[i]) {
//       correctOrderScore++;
//     }
//   }
//   const orderMetric = correctOrderScore / expectedWords.length;

//   // Trim volumeHistory to start from the first instance of speaking
//   const startIndex = volumeHistory.findIndex(
//     (volume) => volume >= volumeThreshold
//   );
//   const trimmedVolumeHistory =
//     startIndex !== -1 ? volumeHistory.slice(startIndex) : [];

//   // Improved speech continuity calculation using trimmedVolumeHistory
//   let totalMoments = trimmedVolumeHistory.length;
//   let speakingMoments = trimmedVolumeHistory.filter(
//     (volume) => volume >= volumeThreshold
//   ).length;
//   const speechContinuity =
//     totalMoments > 0 ? speakingMoments / totalMoments : 0;

//   // Calculate edit distance for a rough measure of overall accuracy
//   const editDistance = getEditDistance(
//     normalize(recognizedSpeech || ""),
//     normalize(expectedText)
//   );
//   const editDistanceScore =
//     (expectedText.length - editDistance) / expectedText.length;

//   // Combine metrics into a fluency score
//   const fluencyScore =
//     (wordAccuracy + speechContinuity + orderMetric + editDistanceScore) / 4;
//   console.log("wordAccuracy: ", wordAccuracy);
//   console.log("speechContinuity: ", speechContinuity);
//   console.log("orderMetric: ", orderMetric);
//   console.log("editDistanceScore: ", editDistanceScore);
//   console.log("fluencyScore: ", fluencyScore);
//   // Convert the score to a percentage
//   const fluencyPercentage = Math.round(fluencyScore * 100);
//   return fluencyPercentage <= 100 ? fluencyPercentage : 100;
// };

// // Placeholder function for edit distance (Levenshtein Distance)
// function getEditDistance(a, b) {
//   // Implementation of the Levenshtein distance
//   if (a.length === 0) return b.length;
//   if (b.length === 0) return a.length;
//   let matrix = [];

//   // Increment along the first column of each row
//   for (let i = 0; i <= b.length; i++) {
//     matrix[i] = [i];
//   }

//   // Increment each column in the first row
//   for (let j = 0; j <= a.length; j++) {
//     matrix[0][j] = j;
//   }

//   // Fill in the rest of the matrix
//   for (let i = 1; i <= b.length; i++) {
//     for (let j = 1; j <= a.length; j++) {
//       if (b.charAt(i - 1) === a.charAt(j - 1)) {
//         matrix[i][j] = matrix[i - 1][j - 1];
//       } else {
//         matrix[i][j] = Math.min(
//           matrix[i - 1][j - 1] + 1, // substitution
//           Math.min(
//             matrix[i][j - 1] + 1, // insertion
//             matrix[i - 1][j] + 1
//           )
//         ); // deletion
//       }
//     }
//   }

//   return matrix[b.length][a.length];
// }
