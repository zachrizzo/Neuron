import { StyleSheet, Text, View, TextInput } from "react-native";
import React from "react";
import { colorsDark } from "../../utility/color";

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
  onFocus,
  autoCapitalize = "none",
}) => {
  const inputType = keyboardType || "default";
  return (
    <TextInput
      style={[
        styles.input,
        {
          borderColor: colorsDark.accent,
          opacity: editable ? 1 : 0.5,
          width: width ? width : "80%",
          height: height ? height : 40,
          borderRadius: borderRadius ? borderRadius : 20,
          fontSize: fontSize ? fontSize : 16,
          color: textColor ? textColor : "#FFFFFF",
          backgroundColor: backgroundColor
            ? backgroundColor
            : colorsDark.accent,
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
      onFocus={onFocus}
      autoCapitalize={autoCapitalize}
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
