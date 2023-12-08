import React, { useState } from "react";
import { StyleSheet, Text, View, Switch as RNSwitch } from "react-native";

const SwitchComponent = ({ setIsEnabled, isEnabled }) => {
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <RNSwitch
      trackColor={{ false: "#767577", true: "#00FF73" }}
      thumbColor={isEnabled ? "#FFFFFF" : "#000000"}
      ios_backgroundColor="#A1A1A1"
      onValueChange={toggleSwitch}
      value={isEnabled}
    />
  );
};

export default SwitchComponent;

const styles = StyleSheet.create({});
