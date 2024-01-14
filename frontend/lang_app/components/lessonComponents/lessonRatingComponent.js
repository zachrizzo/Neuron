import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { colorsDark } from "../../utility/color";
import RoundButton from "../buttons/roundButtons";
import { Ionicons } from "@expo/vector-icons";

const LessonRatingComponent = ({ rating, setRating }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Is this lesson Helpful, or can it be improved?
      </Text>
      <View style={styles.ratingButtonView}>
        <RoundButton
          color={"#FFFFFF00"}
          icon={
            <Ionicons
              name="ios-thumbs-up"
              size={24}
              color={rating === "good" ? colorsDark.green : "white"}
            />
          }
          onPress={
            rating === "good" ? () => setRating(null) : () => setRating("good")
          }
        />
        <RoundButton
          color={"#FFFFFF00"}
          icon={
            <Ionicons
              name="ios-thumbs-down"
              size={24}
              color={rating === "bad" ? colorsDark.red : "white"}
            />
          }
          onPress={
            rating === "bad" ? () => setRating(null) : () => setRating("bad")
          }
        />
      </View>
    </View>
  );
};

export default LessonRatingComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colorsDark.accent,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    width: Dimensions.get("screen").width / 1.3,
    borderRadius: 15,
  },
  ratingButtonView: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  text: {
    color: colorsDark.white,
    fontSize: 15,
    // marginBottom: 5,
    marginTop: 10,
    marginHorizontal: 5,
    textAlign: "center",
  },
});
