import { Text, View, TextInput, TextComponent } from "react-native";
import React from "react";

const SelectableText = ({ style, text }) => {
  return (
    <TextInput
      multiline={true}
      scrollEnabled={false}
      editable={false}
      style={style}
    >
      {text}
    </TextInput>
  );
};

export default SelectableText;
