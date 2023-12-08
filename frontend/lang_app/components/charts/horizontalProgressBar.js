import React, { useEffect, useRef } from "react";
import { View, Animated, Text, StyleSheet } from "react-native";

const HorizontalProgressBar = ({
  progress,
  height,
  backgroundColor,
  progressColor,
  width,
  margin,
  verticalMargin,
  horizontalMargin,
  marginRight,
  marginLeft,
  marginTop,
  marginBottom,
  label, // New prop for the label text
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const animatedProgressWidth = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", `${progress}%`],
  });

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.container,
          {
            width: width,
            backgroundColor,
            margin,
            height,
            marginHorizontal: horizontalMargin,
            marginLeft,
            marginRight,
            marginTop,
            marginBottom,
            marginVertical: verticalMargin,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: `${progress}%`,
              backgroundColor: progressColor,
              borderRadius: 50,
            },
          ]}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    overflow: "hidden",
    padding: 5, // Padding around the entire container
  },
  progressBar: {
    height: "100%",
    justifyContent: "center", // Center text vertically
    alignItems: "flex-start", // Align text to the left
  },
  label: {
    fontSize: 14, // Font size for the label
    fontWeight: "bold",
    color: "#000", // Color of the label text
    marginBottom: 5, // Space between label and progress bar
    color: "white",
  },
});

export default HorizontalProgressBar;
