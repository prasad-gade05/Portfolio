import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, animate } from 'framer-motion';
import './AnimatedName.css';

const LANGUAGES = ["GADE", "गडे", "가데", "ガデ"];
const NAME_CHARS = "PRASAD".split("");
const CHAR_COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#eab308', '#a855f7', '#ec4899'];

const AnimatedName = () => {
  const [langIndex, setLangIndex] = useState(0);
  
  // Idle State
  const [isIdle, setIsIdle] = useState(false);
  const [idleHighlightIndex, setIdleHighlightIndex] = useState(-1);
  const lastInteraction = useRef(Date.now());

  // Magnetic Text Effect State (Local translation)
  const textRef = useRef(null);
  const textX = useMotionValue(0);
  const textY = useMotionValue(0);
  
  // 3D Tilt State (Global rotation)
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  
  // Physics Configs
  const magnetSpringConfig = { damping: 20, stiffness: 400, mass: 0.1 }; // Snappier magnet
  const springX = useSpring(textX, magnetSpringConfig);
  const springY = useSpring(textY, magnetSpringConfig);
  
  const tiltSpringConfig = { stiffness: 600, damping: 30, mass: 0.5 }; // Much snappier tilt
  const springRotateX = useSpring(rotateX, tiltSpringConfig);
  const springRotateY = useSpring(rotateY, tiltSpringConfig);

  // Idle Detection
  useEffect(() => {
    const checkIdle = setInterval(() => {
      if (Date.now() - lastInteraction.current > 3000 && !isIdle) {
        setIsIdle(true);
      }
    }, 1000);
    return () => clearInterval(checkIdle);
  }, [isIdle]);

  // Idle Animation Sequence
  useEffect(() => {
    if (!isIdle) return;

    const runIdleSequence = async () => {
      // Sequence: Tilt Left (Right side comes forward) -> Highlight First Char -> Reset -> Tilt Right -> Highlight Last Char -> Reset
      
      // 1. Tilt slightly to hint interaction (Right side goes back / Left side forward)
      animate(rotateY, -15, { duration: 0.5, ease: "easeInOut" });
      setIdleHighlightIndex(0); // Highlight 'P'
      
      await new Promise(r => setTimeout(r, 400));
      setIdleHighlightIndex(-1);
      
      await new Promise(r => setTimeout(r, 200));
      animate(rotateY, 0, { duration: 0.5, ease: "easeInOut" });
      
      await new Promise(r => setTimeout(r, 800));

      // 2. Tilt other way
      if (!isIdle) return; // Check if still idle
      animate(rotateY, 15, { duration: 0.5, ease: "easeInOut" });
      setIdleHighlightIndex(NAME_CHARS.length - 1); // Highlight 'D'
      
      await new Promise(r => setTimeout(r, 400));
      setIdleHighlightIndex(-1);
      
      await new Promise(r => setTimeout(r, 200));
      animate(rotateY, 0, { duration: 0.5, ease: "easeInOut" });
    };

    // Run immediately and then interval
    runIdleSequence();
    const interval = setInterval(runIdleSequence, 6000);
    
    return () => clearInterval(interval);
  }, [isIdle, rotateY]);

  // Local Mouse Logic for Magnetic + Tilt
  const handleTextMouseMove = (e) => {
    // Reset Idle
    lastInteraction.current = Date.now();
    if (isIdle) {
      setIsIdle(false);
      setIdleHighlightIndex(-1);
      // Ensure we clear any idle animations on the values
      rotateX.stop();
      rotateY.stop();
    }

    if (!textRef.current) return;
    const rect = textRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Distance from center
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    // Magnetic pull
    textX.set(distanceX * 0.2); 
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
            animate={
              isIdle && idleHighlightIndex === i 
                ? { color: CHAR_COLORS[i % CHAR_COLORS.length], y: -5 } 
                : { color: 'var(--accent-cyan)', y: 0 }
            }
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
