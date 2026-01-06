import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  // Use MotionValues to track position without triggering React re-renders
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Spring physics for smooth trailing effect
  const springConfig = { damping: 35, stiffness: 500 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Transformations to center the cursor elements
  const mainX = useTransform(cursorX, (val) => val - 8);
  const mainY = useTransform(cursorY, (val) => val - 8);
  
  const ringX = useTransform(cursorXSpring, (val) => val - 16);
  const ringY = useTransform(cursorYSpring, (val) => val - 16);
  
  const glowX = useTransform(cursorXSpring, (val) => val - 64);
  const glowY = useTransform(cursorYSpring, (val) => val - 64);

  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') !== null ||
        target.closest('a') !== null
      );
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Main Dot - Direct follow */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: mainX,
          y: mainY,
          borderRadius: '50%'
        }}
        animate={{
          scale: isPointer ? 1.5 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
      
      {/* Trailing Ring - Spring follow - Uses CSS Variables */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border rounded-full pointer-events-none z-[9998]"
        style={{
          x: ringX,
          y: ringY,
          borderRadius: '50%', // Explicit fix for square rendering
          borderColor: isPointer ? 'rgb(var(--color-secondary))' : 'rgb(var(--color-primary))'
        }}
        animate={{
          scale: isPointer ? 1.5 : 1,
        }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Faint Glow Aura */}
      <motion.div
         className="fixed top-0 left-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full pointer-events-none z-[9990]"
         style={{
            x: glowX,
            y: glowY,
            borderRadius: '50%'
         }}
      />
    </>
  );
};