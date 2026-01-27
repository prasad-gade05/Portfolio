import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const idleTimeoutRef = useRef(null);

  // Magnetic Text Effect State (Local translation)
  const textRef = useRef(null);
  const textX = useMotionValue(0);
  const textY = useMotionValue(0);
  
  // 3D Tilt State (Global rotation)
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  // Ghost Cursor State
  const ghostX = useMotionValue(0);
  const ghostY = useMotionValue(0);
  const ghostOpacity = useMotionValue(0);
  
  // Physics Configs
  const magnetSpringConfig = { damping: 20, stiffness: 400, mass: 0.1 };
  const springX = useSpring(textX, magnetSpringConfig);
  const springY = useSpring(textY, magnetSpringConfig);
  
  const tiltSpringConfig = { stiffness: 600, damping: 30, mass: 0.5 };
  const springRotateX = useSpring(rotateX, tiltSpringConfig);
  const springRotateY = useSpring(rotateY, tiltSpringConfig);

  // Reusable Physics Logic
  const applyPhysics = useCallback((offsetX, offsetY, rect) => {
    // Magnetic pull
    textX.set(offsetX * 0.2); 
    textY.set(offsetY * 0.2);

    // Tilt Logic
    const MAX_ROTATION = 35;
    const radius = Math.min(rect.width, rect.height) / 2;
    
    const xPct = Math.max(-1, Math.min(1, offsetX / radius));
    const yPct = Math.max(-1, Math.min(1, offsetY / radius));
    
    const rotY = xPct * -MAX_ROTATION; 
    const rotX = yPct * MAX_ROTATION;

    rotateX.set(rotX);
    rotateY.set(rotY);
  }, [textX, textY, rotateX, rotateY]);

  // Idle Detection
  useEffect(() => {
    const checkIdle = setInterval(() => {
      if (Date.now() - lastInteraction.current > 3000 && !isIdle) {
        setIsIdle(true);
      }
    }, 1000);
    return () => clearInterval(checkIdle);
  }, [isIdle]);

  // Idle Animation Sequence with Ghost Cursor
  useEffect(() => {
    if (!isIdle || !textRef.current) return;

    const rect = textRef.current.getBoundingClientRect();
    const radius = Math.min(rect.width, rect.height) / 2;
    
    // Animation controls
    let controls = [];

    const runIdleSequence = async () => {
      // Reset
      ghostOpacity.set(0);
      ghostX.set(0);
      ghostY.set(0);

      // Fade in cursor
      controls.push(animate(ghostOpacity, 1, { duration: 0.3 }));
      
      // Move Left (Tilt Right)
      // Simulate moving from center to left
      const moveLeft = animate(0, -radius * 0.8, {
        duration: 0.8,
        ease: "easeInOut",
        onUpdate: (val) => {
          ghostX.set(val); // Visual cursor
          applyPhysics(val, 0, rect); // Apply physics
          
          // Highlight 'P' when mostly left
          if (val < -radius * 0.5) setIdleHighlightIndex(0);
          else setIdleHighlightIndex(-1);
        }
      });
      controls.push(moveLeft);
      await moveLeft.then();

      // Move Right (Tilt Left)
      const moveRight = animate(-radius * 0.8, radius * 0.8, {
        duration: 1.2,
        ease: "easeInOut",
        onUpdate: (val) => {
          ghostX.set(val);
          applyPhysics(val, 0, rect);

          // Highlight 'D' when mostly right
          if (val > radius * 0.5) setIdleHighlightIndex(NAME_CHARS.length - 1);
          else setIdleHighlightIndex(-1);
        }
      });
      controls.push(moveRight);
      await moveRight.then();

      // Return Center & Fade Out
      const moveCenter = animate(radius * 0.8, 0, {
        duration: 0.8,
        ease: "easeInOut",
        onUpdate: (val) => {
          ghostX.set(val);
          applyPhysics(val, 0, rect);
          setIdleHighlightIndex(-1);
        }
      });
      controls.push(moveCenter);
      controls.push(animate(ghostOpacity, 0, { duration: 0.5, delay: 0.3 }));
      
      await moveCenter.then();
    };

    // Run immediately and then interval
    runIdleSequence();
    const interval = setInterval(runIdleSequence, 5000);
    
    return () => {
      clearInterval(interval);
      controls.forEach(c => c.stop());
    };
  }, [isIdle, ghostX, ghostY, ghostOpacity, applyPhysics]);

  // Local Mouse Logic
  const handleTextMouseMove = (e) => {
    // Reset Idle
    lastInteraction.current = Date.now();
    if (isIdle) {
      setIsIdle(false);
      setIdleHighlightIndex(-1);
      ghostOpacity.set(0);
    }

    if (!textRef.current) return;
    const rect = textRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const offsetX = e.clientX - centerX;
    const offsetY = e.clientY - centerY;
    
    applyPhysics(offsetX, offsetY, rect);
  };

  const handleTextMouseLeave = () => {
    lastInteraction.current = Date.now();
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
      {/* Ghost Cursor with Trail */}
      <motion.div 
        className="ghost-cursor"
        style={{ 
          x: ghostX, 
          y: ghostY,
          opacity: ghostOpacity 
        }}
      />

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
