import React, { useEffect, useRef, useState } from "react";
import { Dimensions } from "react-native";
import { Canvas, Rect } from "@shopify/react-native-skia";
import { colorsDark } from "../../utility/color";

const { width, height } = Dimensions.get("screen");

const numConfetti = 50;

const createConfetti = () => ({
  x: width / 2, // Start in the middle of the screen
  y: height / 2, // Start in the middle of the screen
  vx: (Math.random() - 0.5) * 20, // Horizontal velocity
  vy: -(Math.random() * 15 + 15), // Upward velocity
  size: Math.random() * 10 + 5,
  color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
    Math.random() * 255
  )}, ${Math.floor(Math.random() * 255)}, 1)`,
});

const Confetti = () => {
  const [_, setTick] = useState(0);
  const confettiRef = useRef(
    Array.from({ length: numConfetti }, createConfetti)
  );

  useEffect(() => {
    const update = () => {
      confettiRef.current = confettiRef.current.map((particle) => {
        const newY = particle.y + particle.vy;
        const newX = particle.x + particle.vx;
        const newVy = particle.vy + 0.5; // Apply gravity

        if (newY > height) {
          // Reset particle once it falls out of view
          return createConfetti();
        }

        return { ...particle, x: newX, y: newY, vy: newVy };
      });

      setTick((tick) => tick + 1);
      requestAnimationFrame(update);
    };

    const animationFrame = requestAnimationFrame(update);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <Canvas
      style={{
        flex: 1,
        width: width,
        height: height,
        backgroundColor: colorsDark.mainBackground,
      }}
    >
      {confettiRef.current.map((particle, index) => (
        <Rect
          key={index}
          x={particle.x}
          y={particle.y}
          width={particle.size}
          height={particle.size}
          color={particle.color}
        />
      ))}
    </Canvas>
  );
};

export default Confetti;
