import { StyleSheet, Text, View } from "react-native";
import React from "react";

const DividerLine = ({
  color,
  width,
  marginVertical,
  marginTop,
  marginBottom,
  rotate90, // new prop to rotate the view by 90 degrees
}) => {
  return (
    <View
      style={{
        backgroundColor: color ? color : "#FFFFFF",
        width: width ? width : "80%",
        marginVertical: marginVertical,
        borderRadius: 20,
        height: 2,
        marginTop: marginTop,
        marginBottom: marginBottom,
        transform: rotate90 ? [{ rotate: "90deg" }] : [], // rotate the view by 90 degrees if rotate90 prop is true
      }}
    />
  );
};

export default DividerLine;
