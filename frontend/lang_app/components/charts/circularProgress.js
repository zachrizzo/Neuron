import React, { useRef, useEffect, useState } from "react";
import { Animated, View, Text } from "react-native";
import { Svg, Circle } from "react-native-svg";

const CircularProgress = ({
  size,
  strokeWidth,
  progress,
  color,
  label,
  textColor,
  marginTop,
  marginBottom,
  marginHorizontal,
  marginLeft,
  marginRight,
  marginVertical,
  backGroundColor,
  progressTextLeft,
  progressTextTop,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayedProgress, setDisplayedProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  useEffect(() => {
    const listener = animatedValue.addListener((v) => {
      setDisplayedProgress(Math.round(v.value));
    });

    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [progress]);

  return (
    <View
      style={{
        marginTop,
        marginBottom,
        marginHorizontal,
        marginLeft,
        marginRight,
        marginVertical,
      }}
    >
      {label && ( // Conditionally render the label
        <Text
          style={{
            textAlign: "center",
            marginBottom: 10,
            color: "white",
            fontSize: 16,
            fontStyle: "italic",
          }}
        >
          {label}
        </Text>
      )}
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          stroke={backGroundColor ? backGroundColor : "#e6e6e6"}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <AnimatedCircle
          stroke={color || "#007AFF"}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
      </Svg>
      <View
        style={{
          position: "absolute",
          left: progressTextLeft,
          top: progressTextTop,
          transform: [{ translateX: -size / 4 }, { translateY: -size / 4 }],
        }}
      >
        <Text
          style={{
            fontSize: 18,
            textAlign: "center",
            color: textColor || "white",
          }}
        >
          {`${displayedProgress}%`}
        </Text>
      </View>
    </View>
  );
};

// AnimatedCircle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default CircularProgress;
