import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import './ClickSparkle.css';

// Generate sparkle configuration at creation time (not render time)
const generateSparkleConfig = () => {
  const lineCount = 10 + Math.floor(Math.random() * 4); // 10-13 lines
  return Array.from({ length: lineCount }).map((_, i) => ({
    id: i,
    angle: (360 / lineCount) * i + (Math.random() * 20 - 10),
    length: 12 + Math.random() * 14,
    width: 2 + Math.random() * 1,
    color: Math.random() > 0.6 ? '#ffffff' : 'var(--accent-cyan)'
  }));
};

const Sparkle = ({ x, y, lines, onComplete }) => {  return (
    <motion.div
      className="click-sparkle-container"
      style={{ left: x, top: y }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }} // Increased duration
      onAnimationComplete={onComplete}
    >
      {lines.map((line) => (
        <div
          key={line.id}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `rotate(${line.angle}deg)`,
            pointerEvents: 'none'
          }}
        >
          <motion.div
            style={{
              width: line.length,
              height: line.width, // Use variable width
              backgroundColor: line.color,
              borderRadius: '2px', // Slightly rounder
              position: 'absolute',
              top: `-${line.width / 2}px`, // Center vertically
              left: '0',
              boxShadow: `0 0 8px ${line.color}`, // Added glow for visibility
            }}
            initial={{ x: 6, scaleX: 0, opacity: 1 }} 
            animate={{ x: 35, scaleX: 1, opacity: 0 }} // Move further out
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      ))}
    </motion.div>
  );
};

const ClickSparkle = () => {
  const [sparkles, setSparkles] = useState([]);
  const nextSparkleIdRef = useRef(0);

  const addSparkle = useCallback((e) => {
    const newSparkle = {
      id: nextSparkleIdRef.current++,
      x: e.clientX,
      y: e.clientY,
      lines: generateSparkleConfig()
    };
    setSparkles(prev => [...prev, newSparkle]);
  }, []);

  const removeSparkle = useCallback((id) => {
    setSparkles(prev => prev.filter(s => s.id !== id));
  }, []);

  useEffect(() => {
    window.addEventListener('click', addSparkle);
    return () => window.removeEventListener('click', addSparkle);
  }, [addSparkle]);

  return (
    <div className="click-sparkle-overlay">
      <AnimatePresence>
        {sparkles.map(sparkle => (
          <Sparkle
            key={sparkle.id}
            x={sparkle.x}
            y={sparkle.y}
            lines={sparkle.lines}
            onComplete={() => removeSparkle(sparkle.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ClickSparkle;
