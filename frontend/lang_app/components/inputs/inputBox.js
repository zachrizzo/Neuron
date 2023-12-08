import { StyleSheet, Text, View, TextInput } from "react-native";
import React from "react";

const InputBox = ({
  onChangeText,
  value,
  placeholder,
  editable,
  width,
  height,
  borderRadius,
  keyboardType,
  fontSize,
  textColor,
  backgroundColor,
  placeholderTextColor,
}) => {
  const inputType = keyboardType || "default";
  return (
    <TextInput
      style={[
        styles.input,
        {
          opacity: editable ? 1 : 0.5,
          width: width ? width : "80%",
          height: height ? height : 40,
          borderRadius: borderRadius ? borderRadius : 20,
          fontSize: fontSize ? fontSize : 16,
          color: textColor ? textColor : "#FFFFFF",
          backgroundColor: backgroundColor ? backgroundColor : "#535353D5",
        },
      ]}
      keyboardType={inputType}
      onChangeText={onChangeText}
      value={value}
      placeholder={placeholder}
      keyboardAppearance="dark"
      editable={editable}
      placeholderTextColor={
        placeholderTextColor ? placeholderTextColor : "#FFFFFF8D"
      }
    />
  );
};

export default InputBox;

const styles = StyleSheet.create({
  input: {
    padding: 10,
    marginBottom: 20,
    marginHorizontal: 10,
  },
});
