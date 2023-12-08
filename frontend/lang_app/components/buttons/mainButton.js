import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

const MainButton = ({
  onPress,
  title,
  margin,
  marginVertical,
  marginHorizontal,
  marginBottom,
  marginTop,
  isLoading,
  shadow,
  borderRadius,
  disabled,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        {
          margin: margin,
          marginVertical: marginVertical,
          marginHorizontal: marginHorizontal,
          marginBottom: marginBottom,
          marginTop: marginTop,
        },
        shadow && {
          shadowColor: "#00000090",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 5,
        },
        borderRadius ? { borderRadius: borderRadius } : { borderRadius: 20 },
      ]}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default MainButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007bff", // A nice shade of blue
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    // elevation: 2, // For Android shadow
    // shadowColor: "#000", // For iOS shadow
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    width: "80%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
