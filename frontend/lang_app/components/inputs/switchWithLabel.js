import React from "react";
import { StyleSheet, Text, View } from "react-native";
import SwitchComponent from "./switch";
const SwitchWithLabel = ({ label, setIsEnabled, isEnabled, textColor }) => {
  return (
    <View style={styles.container}>
      <Text
        style={[
          textColor ? { color: textColor } : { color: "white" },
          {
            fontSize: 16,
            fontWeight: "bold",
            marginRight: 20,
          },
        ]}
      >
        {label}
      </Text>
      <SwitchComponent setIsEnabled={setIsEnabled} isEnabled={isEnabled} />
    </View>
  );
};

export default SwitchWithLabel;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    marginVertical: 5,
  },
});
