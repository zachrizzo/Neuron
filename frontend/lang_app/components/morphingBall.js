import React, { useEffect, useState } from "react";
import { Dimensions, Pressable, Text, TouchableOpacity } from "react-native";
import { Canvas, Circle, Line } from "@shopify/react-native-skia";
import {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedReaction,
} from "react-native-reanimated";
import { colorsDark } from "../utility/color";

const { width, height } = Dimensions.get("screen");

const numBalls = 25;
const ballRadius = 8;
const gravitationalConstant = 100;
const initialVelocity = 3;
const connectionDistance = 100;
const maxVelocity = 2; // Maximum allowed velocity
const softeningParameter = 0.5; // Adjust this value to prevent extreme forces at small distances

const distance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

const MorphingBall = () => {
  // Create an array to hold the balls
  const balls = [];
  const [connections, setConnections] = useState([]);
  const [tapInfo, setTapInfo] = useState(false);
  // Initialize each ball outside of Array.from
  for (let i = 0; i < numBalls; i++) {
    balls.push({
      x: useSharedValue(Math.random() * width),
      y: useSharedValue((Math.random() * height) / 3),
      vx: useSharedValue((Math.random() * 2 - 1) * initialVelocity),
      vy: useSharedValue((Math.random() * 2 - 1) * initialVelocity),
    });
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const newConnections = [];

      balls.forEach((ball1, index1) => {
        let fx = 0;
        let fy = 0;

        balls.forEach((ball2, index2) => {
          if (index1 !== index2) {
            const dx = ball2.x.value - ball1.x.value;
            const dy = ball2.y.value - ball1.y.value;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // // Collision detection and response
            // if (dist < 5 * ballRadius && tapInfo) {
            //   console.log("tapInfo");
            //   // Elastic collision response
            //   const angle = Math.atan2(dy, dx);
            //   const speed1 = Math.sqrt(
            //     ball1.vx.value * ball1.vx.value +
            //       ball1.vy.value * ball1.vy.value
            //   );
            //   const speed2 = Math.sqrt(
            //     ball2.vx.value * ball2.vx.value +
            //       ball2.vy.value * ball2.vy.value
            //   );
            //   const direction1 = Math.atan2(ball1.vy.value, ball1.vx.value);
            //   const direction2 = Math.atan2(ball2.vy.value, ball2.vx.value);

            //   const vx1 = speed1 * Math.cos(direction1 - angle);
            //   const vy1 = speed1 * Math.sin(direction1 - angle);
            //   const vx2 = speed2 * Math.cos(direction2 - angle);
            //   const vy2 = speed2 * Math.sin(direction2 - angle);

            //   const final_vx1 = (vx1 * (1 - 1) + 2 * 1 * vx2) / (1 + 1);
            //   const final_vx2 = (vx2 * (1 - 1) + 2 * 1 * vx1) / (1 + 1);

            //   ball1.vx.value =
            //     Math.cos(angle) * final_vx1 +
            //     Math.cos(angle + Math.PI / 2) * vy1;
            //   ball1.vy.value =
            //     Math.sin(angle) * final_vx1 +
            //     Math.sin(angle + Math.PI / 2) * vy1;
            //   ball2.vx.value =
            //     Math.cos(angle) * final_vx2 +
            //     Math.cos(angle + Math.PI / 2) * vy2;
            //   ball2.vy.value =
            //     Math.sin(angle) * final_vx2 +
            //     Math.sin(angle + Math.PI / 2) * vy2;
            // }

            // Calculate gravitational forces
            if (dist > softeningParameter && dist >= 3 * ballRadius) {
              const forceMagnitude =
                gravitationalConstant /
                (dist * dist + softeningParameter * softeningParameter);
              const angle = Math.atan2(
                ball2.y.value - ball1.y.value,
                ball2.x.value - ball1.x.value
              );
              fx += forceMagnitude * Math.cos(angle);
              fy += forceMagnitude * Math.sin(angle);
            }

            // Check for connections
            if (dist < connectionDistance) {
              newConnections.push([index1, index2]);
            }
          }
        });

        // Damping factor to reduce the velocity over time
        const damping = 0.999;
        ball1.vx.value = (ball1.vx.value + fx) * damping;
        ball1.vy.value = (ball1.vy.value + fy) * damping;

        // Update ball positions
        ball1.x.value += ball1.vx.value;
        ball1.y.value += ball1.vy.value;

        if (ball1.x.value / ballRadius < 0 && ball1.vx.value < 0) {
          ball1.x.value = width;
        } else if (ball1.x.value + ballRadius >= width && ball1.vx.value > 0) {
          ball1.x.value = 1; // Move just inside the left edge
        }

        if (ball1.y.value - ballRadius < 0 && ball1.vy.value < 0) {
          ball1.y.value = height; // Move just inside the bottom edge
        } else if (ball1.y.value + ballRadius >= height && ball1.vy.value > 0) {
          ball1.y.value = 1; // Move just inside the top edge
        }
      });

      // Update state with new connections
      setConnections(newConnections);
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return (
    // <Pressable
    //   onPress={() => {
    //     setTapInfo(!tapInfo);
    //     console.log("tapInfo", tapInfo);
    //   }}
    // >
    <Canvas
      style={{
        width: width,
        backgroundColor: colorsDark.mainBackground,
        height: height,
        zIndex: 0,
      }}
    >
      {balls.map((ball, index) => (
        <Circle
          key={index}
          cx={ball.x}
          cy={ball.y}
          r={ballRadius}
          color="white"
        />
      ))}
      {connections.map((connection, index) => {
        const startBall = balls[connection[0]];
        const endBall = balls[connection[1]];

        if (startBall && endBall) {
          return (
            <Line
              key={index}
              x1={startBall.x.value}
              y1={startBall.y.value}
              x2={endBall.x.value}
              y2={endBall.y.value}
              strokeWidth={1}
              // as the balls get closer fade from white to red
              // color={`rgba(255, ${
              //   255 -
              //   Math.floor(
              //     (255 *
              //       distance(
              //         startBall.x.value,
              //         startBall.y.value,
              //         endBall.x.value,
              //         endBall.y.value
              //       )) /
              //       connectionDistance
              //   )
              // }, ${
              //   255 -
              //   Math.floor(
              //     (255 *
              //       distance(
              //         startBall.x.value,
              //         startBall.y.value,
              //         endBall.x.value,
              //         endBall.y.value
              //       )) /
              //       connectionDistance
              //   )
              // }, 1)`}
              color={"white"}
              p1={{ x: startBall.x.value, y: startBall.y.value }}
              p2={{ x: endBall.x.value, y: endBall.y.value }}
              //interpulate the opacity based on the distance between the two balls (closer = more opaque)starting at 50
              opacity={
                1 -
                distance(
                  startBall.x.value,
                  startBall.y.value,
                  endBall.x.value,
                  endBall.y.value
                ) /
                  connectionDistance
              }
            />
          );
        }
      })}
    </Canvas>
    // </Pressable>
  );
};

export default MorphingBall;
