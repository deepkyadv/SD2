import { RoundedBox, Text3D } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Animated 3D Text with Working Falling Effect
function AnimatedText({ text, position, delay, animationType, color }) {
  const textRef = useRef();

  useEffect(() => {
    if (textRef.current) {
      if (animationType === "fall") {
        gsap.fromTo(
          textRef.current.position,
          { y: 12 },
          { y: position[1], duration: 1.2, ease: "bounce.out", delay }
        );
      } else if (animationType === "scale") {
        gsap.fromTo(
          textRef.current.scale,
          { x: 0, y: 0, z: 0 },
          { x: 1, y: 1, z: 1, duration: 1.2, ease: "power2.out", delay }
        );
      }

      gsap.to(textRef.current.scale, {
        x: 1.3,
        y: 1.3,
        z: 1.3,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(textRef.current.material.color, {
        r: Math.random(),
        g: Math.random(),
        b: Math.random(),
        repeat: -1,
        yoyo: true,
        duration: 3,
      });
    }
  }, [position, delay, animationType]);

  return (
    <mesh ref={textRef} position={position}>
      <Text3D
        font="https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
        size={1.2}
        height={0.2}
        bevelEnabled
        bevelThickness={0.03}
        bevelSize={0.02}
        bevelSegments={10}
      >
        {text}
        <meshStandardMaterial
          emissive={color}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </Text3D>
    </mesh>
  );
}

// ✅ 3D Button Component with Random Movement on Hover
function Button3D({ text, position, color, onClick, isMovable }) {
  const buttonRef = useRef();
  const textRef = useRef();
  const [buttonPos, setButtonPos] = useState(position);

  const handlePointerOver = () => {
    document.body.style.cursor = "pointer"; // ✅ Change cursor to pointer
    gsap.to(buttonRef.current.scale, { x: 1.1, y: 1.1, z: 1.1, duration: 0.3 });
    gsap.to(textRef.current.scale, { x: 1.1, y: 1.1, z: 1.1, duration: 0.3 });

    // ✅ If button is "Not Good", move it randomly
    if (isMovable) {
      const randomX = (Math.random() - 0.5) * 14; // Keeps within bounds
      const randomY = (Math.random() - 0.5) * 8;

      gsap.to(buttonRef.current.position, {
        x: randomX,
        y: randomY,
        duration: 0.5,
        ease: "power2.out",
        onUpdate: () => setButtonPos([randomX, randomY, 0]), // Update state
      });
    }
  };

  const handlePointerOut = () => {
    document.body.style.cursor = "default"; // ✅ Reset cursor
    gsap.to(buttonRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
    gsap.to(textRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
  };

  return (
    <group
      ref={buttonRef}
      position={buttonPos}
      onClick={onClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Button Background */}
      <RoundedBox args={[6, 1.5, 0.4]} radius={0.2} position={[1.7, 0.2, 0]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </RoundedBox>

      {/* Button Text */}
      <mesh ref={textRef} position={[0, 0, 0.25]}>
        <Text3D
          font="https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
          size={0.6}
          height={0.1}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.015}
          bevelSegments={8}
        >
          {text}
          <meshStandardMaterial
            emissive="#FFFFFF"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </Text3D>
      </mesh>
    </group>
  );
}

// ✅ Main App Component
function HomePage() {
  const navigate = useNavigate();
  const line1 = ["HEY!", "GUYS"];
  const line2 = ["How", "Are", "You", "Today"];
  const letterSpacing = 1.3;
  const wordSpacing = 2;
  const colors = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
  ];

  function renderTextLine(words, yPosition, animationType, startDelay = 0) {
    let xOffset =
      -(
        words.join("").length * letterSpacing +
        (words.length - 1) * wordSpacing
      ) / 2;

    return words.flatMap((word, wordIndex) => {
      const wordLetters = word.split("");
      const wordStartX = xOffset;
      xOffset += wordLetters.length * letterSpacing + wordSpacing;

      return wordLetters.map((letter, letterIndex) => (
        <AnimatedText
          key={`${wordIndex}-${letterIndex}`}
          text={letter}
          position={[wordStartX + letterIndex * letterSpacing, yPosition, 0]}
          delay={(wordIndex + letterIndex) * 0.3 + startDelay}
          animationType={animationType}
          color={colors[(wordIndex + letterIndex) % colors.length]}
        />
      ));
    });
  }

  return (
    <Canvas
      camera={{ position: [0, -1, 14], fov: 75 }}
      style={{ width: "100vw", height: "100vh", background: "black" }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={2} color="white" />

      {renderTextLine(line1, 2, "fall")}
      {renderTextLine(line2, -1.5, "scale", 1)}

      {/* 3D Buttons */}
      <Button3D
        text="I Am Good"
        position={[-7, -5, 0]}
        color="#00FF00"
        onClick={()=>{ navigate('/happy');}}
      />
      <Button3D
        text="Not Good"
        position={[0.9, -5, 0]}
        color="#FF0000"
        onClick={() => alert("Hope you feel better soon! ❤️")}
        isMovable // ✅ This makes the button move on hover
      />
    </Canvas>
  );
}

export default HomePage;
