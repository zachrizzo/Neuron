import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React from "react";
import MorphingBall from "../morphingBall";
import { colorsDark } from "../../utility/color";

const LoadingComponent = ({ textUpdateState }) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.backGround}>
        <MorphingBall />
      </View>
      <View style={styles.textBoxView}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.text}>{textUpdateState}</Text>
      </View>
    </View>
  );
};

export default LoadingComponent;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    // width: "100%",
    // height: "100%",
  },

  backGround: {
    backgroundColor: "#FFFFFF",
    // top: 0,
    // left: 0,
    // width: "100%",
    // height: "100%",
    // position: "relative",
    zIndex: 0,
  },
  textBoxView: {
    backgroundColor: colorsDark.accentLowOpacity,
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    zIndex: 50,
    position: "absolute",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 20,
    minWidth: 200,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
});
