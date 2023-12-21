import React from "react";
import { Pressable, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { CheckMark } from "../icons/lineIcons";
import { colorsDark } from "../../utility/color";

export function CheckBox({ testID, setChecked, checked }) {
  return (
    <Pressable
      testID={testID}
      style={[styles.checkBox, checked && styles.checked]}
      onPress={() => setChecked(!checked)}
    >
      {checked && (
        <CheckMark
          testID={"check-box-check-mark"}
          width={35}
          height={35}
          color={"#FFFFFF"}
        />
      )}
    </Pressable>
  );
}

CheckBox.propTypes = {
  setChecked: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
  testID: PropTypes.string,
};

const styles = StyleSheet.create({
  checkBox: {
    width: 28, // 'w-7' in Tailwind
    height: 28, // 'h-7' in Tailwind
    // shadowColor: "#aeaeae",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.5,
    // shadowRadius: 2,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4, // 'rounded-md' in Tailwind
  },
  checked: {
    backgroundColor: colorsDark.blue, // Replace with your main blue color
  },
});
