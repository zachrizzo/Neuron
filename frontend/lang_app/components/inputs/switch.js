import React, { useState } from "react";
import { StyleSheet, Text, View, Switch as RNSwitch } from "react-native";
import { colorsDark } from "../../utility/color";

const SwitchComponent = ({ setIsEnabled, isEnabled }) => {
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <RNSwitch
      trackColor={{ false: "#767577", true: colorsDark.brightGreen }}
      thumbColor={isEnabled ? "#FFFFFF" : colorsDark.mainBackground}
      ios_backgroundColor={colorsDark.accent}
      onValueChange={toggleSwitch}
      value={isEnabled}
    />
  );
};

export default SwitchComponent;

const styles = StyleSheet.create({});
