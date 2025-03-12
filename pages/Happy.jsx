import { Text3D } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { useRef } from "react";

const WaveText = ({ text }) => {
  const words = text.split(" ");
  const wordSpacing = 2; // Space between words
  const letterSpacing = 0.5; // Space between letters
  const wordRefs = useRef([]);

  // ✅ Animate words in a continuous wave using `useFrame`
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime(); // Get time in seconds
    wordRefs.current.forEach((wordMesh, i) => {
      if (wordMesh) {
        wordMesh.position.y = Math.sin(time + i * 0.5) * 2; // Continuous wave motion
      }
    });
  });

  // Calculate total width for centering
  const totalWidth =
    words.reduce((acc, word) => acc + word.length * letterSpacing + wordSpacing, 0) -
    wordSpacing;

  return (
    <>
      {words.map((word, wordIndex) => {
        const wordStartX =
          -totalWidth / 2 +
          words
            .slice(0, wordIndex)
            .reduce((acc, w) => acc + w.length * letterSpacing + wordSpacing, 0);

        return (
          <mesh
            key={wordIndex}
            position={[wordStartX, 0, 0]} // Default position
            ref={(el) => (wordRefs.current[wordIndex] = el)}
          >
            <Text3D
              font="https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
              size={0.8}
              height={0.1}
              bevelEnabled
              bevelThickness={0.008}
              bevelSize={0.005}
              bevelSegments={16}
            >
              {word}
              <meshStandardMaterial
                emissive={"#FFD700"} // Gold color
                emissiveIntensity={1.5}
                toneMapped={false}
              />
            </Text3D>
          </mesh>
        );
      })}
    </>
  );
};

const Happy = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 75 }}
      style={{ width: "100vw", height: "100vh", background: "black" }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[8, 10, 10]} intensity={1.5} color="white" />
      
      <WaveText text="GLAD TO HEAR THAT YOU ARE WELL" />
    </Canvas>
  );
};

export default Happy;
