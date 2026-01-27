import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import './AnimatedName.css';

const LANGUAGES = ["GADE", "गडे", "가데", "ガデ"];
const NAME_CHARS = "PRASAD".split("");
const CHAR_COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#eab308', '#a855f7', '#ec4899'];

const AnimatedName = () => {
  const [langIndex, setLangIndex] = useState(0);

  // Magnetic Text Effect State (Local translation)
  const textRef = useRef(null);
  const textX = useMotionValue(0);
  const textY = useMotionValue(0);
  
  // 3D Tilt State (Global rotation)
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  
  // Physics Configs
  const magnetSpringConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(textX, magnetSpringConfig);
  const springY = useSpring(textY, magnetSpringConfig);
  
  const tiltSpringConfig = { stiffness: 100, damping: 30, mass: 0.5 };
  const springRotateX = useSpring(rotateX, tiltSpringConfig);
  const springRotateY = useSpring(rotateY, tiltSpringConfig);

  // Global Mouse Listener for 3D Tilt - REMOVED in favor of local for "seesaw" effect
  // useEffect(() => { ... })

  // Local Mouse Logic for Magnetic + Tilt
  const handleTextMouseMove = (e) => {
    if (!textRef.current) return;
    const rect = textRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Distance from center
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    // Magnetic pull
    textX.set(distanceX * 0.2); // Increased slightly
    textY.set(distanceY * 0.2);

    // Tilt Logic (Element Relative)
    // Max rotation deg - Increased for more pronounced effect
    const MAX_ROTATION = 35;
    
    // Calculate percentage from center (-1 to 1)
    // Use smaller dimension to make tilt more sensitive
    const radius = Math.min(rect.width, rect.height) / 2;
    
    const xPct = Math.max(-1, Math.min(1, distanceX / radius));
    const yPct = Math.max(-1, Math.min(1, distanceY / radius));
    
    const rotY = xPct * -MAX_ROTATION; 
    const rotX = yPct * MAX_ROTATION;

    rotateX.set(rotX);
    rotateY.set(rotY);
  };

  const handleTextMouseLeave = () => {
    textX.set(0);
    textY.set(0);
    rotateX.set(0);
    rotateY.set(0);
  };

  // Cycle languages every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLangIndex((prev) => (prev + 1) % LANGUAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      ref={textRef}
      className="animated-name-container"
      style={{ 
        x: springX, 
        y: springY,
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d"
      }}
      onMouseMove={handleTextMouseMove}
      onMouseLeave={handleTextMouseLeave}
    >
      {/* Static First Name */}
      <div className="animated-first-name" style={{ pointerEvents: 'auto' }}>
        {NAME_CHARS.map((char, i) => (
          <motion.span
            key={i}
            className="animated-char"
            whileHover={{ 
              color: CHAR_COLORS[i % CHAR_COLORS.length],
              y: -5 
            }}
            style={{ 
              display: "inline-block",
              transformStyle: "preserve-3d" 
            }}
            transition={{ duration: 0.1 }}
          >
            {char}
          </motion.span>
        ))}
      </div>

      {/* Dynamic Last Name */}
      <div className="animated-last-name-wrapper">
        <AnimatePresence mode="wait">
          <motion.span
            key={LANGUAGES[langIndex]}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.5, ease: "circOut" }}
            className="animated-last-name"
          >
            {LANGUAGES[langIndex]}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AnimatedName;
