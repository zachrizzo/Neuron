import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { CheckBox } from "./checkBox"; // Update the import path accordingly

export function CheckBoxWithLabel({
  text,
  setChecked,
  checked,
  margin,
  checkBoxOnTheLeft,
  testID,
  textColor,
  shadow,
}) {
  return (
    <View
      style={[
        styles.checkBoxContainer,
        checkBoxOnTheLeft && styles.rowReverse,
        margin && { margin: margin },
        shadow && {
          shadowColor: "#aeaeae",
          shadowOffset: { width: 1, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 5,
        },
      ]}
    >
      <Text
        style={[
          styles.labelText,
          textColor ? { color: textColor } : { color: "black" },
        ]}
      >
        {text}
      </Text>
      <CheckBox setChecked={setChecked} checked={checked} testID={testID} />
    </View>
  );
}

CheckBoxWithLabel.propTypes = {
  text: PropTypes.string,
  setChecked: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
  margin: PropTypes.number,
  checkBoxOnTheLeft: PropTypes.bool,
  testID: PropTypes.string,
  textColor: PropTypes.string,
  shadow: PropTypes.bool,
};

const styles = StyleSheet.create({
  checkBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  labelText: {
    marginHorizontal: 8,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});
