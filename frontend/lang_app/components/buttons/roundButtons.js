import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";

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
  volume, // Default volume value if not provided
}) => {
  const buttonSize = size || 50;
  const buttonColor = color || "#007bff";
  const [pulseAnim] = useState(new Animated.Value(1));
  const [volumeAnim] = useState(new Animated.Value(1)); // New Animated.Value for volume

  // useEffect(() => {
  //   if (pulse) {
  //     Animated.loop(
  //       Animated.sequence([
  //         Animated.timing(pulseAnim, {
  //           toValue: 1.2,
  //           duration: 500,
  //           useNativeDriver: true,
  //         }),
  //         Animated.timing(pulseAnim, {
  //           toValue: 1,
  //           duration: 500,
  //           useNativeDriver: true,
  //         }),
  //       ])
  //     ).start();
  //   } else {
  //     pulseAnim.setValue(1);
  //   }
  // }, [pulse, pulseAnim]);

  // useEffect(() => {
  //   // Ensure volume is a number and within range
  //   const validVolume =
  //     !isNaN(volume) && volume >= 0 && volume <= 1 ? volume : 0;

  //   Animated.timing(volumeAnim, {
  //     toValue: 0.5 + 0.5 * validVolume, // This assumes volume is between 0 and 1
  //     duration: 100,
  //     useNativeDriver: true,
  //   }).start();
  // }, [volume, volumeAnim]);

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
        style={[
          styles.volumeView,
          {
            width: volume > 0 ? volume * 30 : 0,
            height: volume > 0 ? volume * 30 : 0,
          },

          // styles.volumeView,
          // {
          //   transform: [{ scale: volumeAnim }],
          // },
        ]}
      />

      {loading ? <ActivityIndicator size="small" color="white" /> : icon}
    </TouchableOpacity>
  );
};

export default RoundButton;

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    padding: 5,
  },
  volumeView: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    width: "100%",
    height: "100%",
    borderRadius: 100,
    opacity: 0.5,
  },
});
