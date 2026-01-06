import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  onClick?: () => void;
  hoverEffect?: boolean;
  enableTilt?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = "", 
  noPadding = false,
  onClick,
  hoverEffect = true,
  enableTilt = true
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Motion values for mouse position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for rotation values to create weight/momentum
  // Reduced stiffness/damping for a more "floaty" premium feel
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  // Map mouse position to rotation degrees (3D Tilt)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]); 
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]); 

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    
    // Calculate normalized position (-0.5 to 0.5) for tilt
    const normalizedX = (clientX - left) / width - 0.5;
    const normalizedY = (clientY - top) / height - 0.5;

    // Calculate exact pixel position for spotlight
    x.set(clientX - left);
    y.set(clientY - top);

    // Update spring values for tilt
    mouseXSpring.set(normalizedX);
    mouseYSpring.set(normalizedY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    mouseXSpring.set(0);
    mouseYSpring.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX: enableTilt ? rotateX : 0,
        rotateY: enableTilt ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      initial={{ scale: 1, zIndex: 1 }}
      whileHover={hoverEffect ? { 
        scale: 1.01, // Subtle scale
        y: -4, 
        zIndex: 50,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" 
      } : {}}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`
        relative overflow-hidden rounded-[2rem] bg-surface/80 backdrop-blur-sm
        group border border-white/5
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Border Glow Effect - Follows Mouse */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-500 group-hover:opacity-100 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${x}px ${y}px,
              rgb(var(--color-primary) / 0.3),
              transparent 40%
            )
          `,
        }}
      />

      {/* Inner Content Mask to create the "Border Only" glow effect */}
      <div className="absolute inset-[1px] bg-surface rounded-[calc(2rem-1px)] z-10" />

      {/* Main Content */}
      <div 
        style={{ transform: "translateZ(20px)" }} 
        className={`relative h-full z-20 ${noPadding ? '' : 'p-8'}`}
      >
        {children}
      </div>

      {/* Inner Spotlight Gradient */}
      <motion.div
        className="pointer-events-none absolute -inset-px transition duration-500 z-30 opacity-0 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              450px circle at ${x}px ${y}px,
              rgb(var(--color-primary) / 0.05),
              transparent 40%
            )
          `,
        }}
      />
      
      {/* Scanline texture for tech feel (optional, kept subtle) */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] z-10 pointer-events-none mix-blend-overlay"></div>
    </motion.div>
  );
};