import { StyleSheet, Text, View } from "react-native";
import React from "react";

const DividerLine = ({ color, width, marginVertical }) => {
  return (
    <View
      style={{
        backgroundColor: color ? color : "#FFFFFF",
        width: width ? width : "80%",
        marginVertical: marginVertical,
        borderRadius: 20,
        height: 2,
      }}
    />
  );
};

export default DividerLine;
