import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Animated } from "react-native";

const RoundButton = ({
  icon,
  size,
  color,
  onPress,
  margin,
  marginHorizontal,
  marginLeft,
  marginRight,
  marginVertical,
  disabled,
  loading,
  pulse,
}) => {
  const buttonSize = size || 50; // Default size if not specified
  const buttonColor = color || "#007bff"; // Default color if not specified
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (pulse) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [pulse, pulseAnim]);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          width: buttonSize,
          height: buttonSize,
          backgroundColor: disabled ? "#909090" : buttonColor,
          borderRadius: buttonSize / 2,
          margin: margin,
          marginHorizontal: marginHorizontal,
          marginLeft: marginLeft,
          marginRight: marginRight,
          marginVertical: marginVertical,
        },
      ]}
    >
      <Animated.View
        style={{
          transform: [{ scale: pulseAnim }],
        }}
      >
        {loading ? <ActivityIndicator size="small" color="white" /> : icon}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default RoundButton;

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    elevation: 2, // Shadow for Android
    // shadowColor: "#000", // Shadow for iOS
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    padding: 5,
  },
});
