import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import Svg, { Path, ClipPath, Defs, Rect } from "react-native-svg";
import { colorsDark } from "../../utility/color";

const LifeIndicator = ({ totalLives, currentLives }) => {
  const fillPercentage = (currentLives / totalLives) * 100;
  const heartPath =
    "M4.45067 13.9082L11.4033 20.4395C11.6428 20.6644 11.7625 20.7769 11.9037 20.8046C11.9673 20.8171 12.0327 20.8171 12.0963 20.8046C12.2375 20.7769 12.3572 20.6644 12.5967 20.4395L19.5493 13.9082C21.5055 12.0706 21.743 9.0466 20.0978 6.92607L19.7885 6.52734C17.8203 3.99058 13.8696 4.41601 12.4867 7.31365C12.2913 7.72296 11.7087 7.72296 11.5133 7.31365C10.1304 4.41601 6.17972 3.99058 4.21154 6.52735L3.90219 6.92607C2.25695 9.0466 2.4945 12.0706 4.45067 13.9082Z";

  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  // Heartbeat pulse animation
  const heartbeat = Animated.loop(
    Animated.sequence([
      Animated.timing(pulseAnimation, {
        toValue: 1.1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]),
    {
      iterations: -1, // Infinite loop
    }
  );

  useEffect(() => {
    // Trigger heartbeat animation if current lives are 2 or less
    if (currentLives <= 2) {
      heartbeat.start();
    } else {
      heartbeat.stop();
      pulseAnimation.setValue(1); // Reset to default scale
    }
  }, [currentLives]);

  useEffect(() => {
    // Trigger shake and scale down/up animation when lives change
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentLives]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          ...styles.heartContainer,
          transform: [
            { translateX: shakeAnimation },
            { scale: currentLives <= 2 ? pulseAnimation : scaleAnimation },
          ],
        }}
      >
        <Svg height="100%" width="100%" viewBox="0 0 24 24">
          <Defs>
            <ClipPath id="clip">
              <Rect
                x="0"
                y={`${100 - fillPercentage}%`}
                width="100%"
                height={`${fillPercentage}%`}
              />
            </ClipPath>
          </Defs>
          <Path
            d={heartPath}
            stroke={colorsDark.red}
            fill={colorsDark.mainBackground}
          />
          <Path d={heartPath} fill={colorsDark.red} clipPath="url(#clip)" />
        </Svg>
        <Text style={styles.text}>{currentLives}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  heartContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
    position: "absolute",
    bottom: 10,
  },
});

export default LifeIndicator;
