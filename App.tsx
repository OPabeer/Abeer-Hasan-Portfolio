import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BentoGrid } from './components/BentoGrid';
import { CustomCursor } from './components/ui/CustomCursor';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { PortfolioProvider } from './context/PortfolioContext';
import { AIChat } from './components/AIChat';

const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white rounded-full opacity-20"
          initial={{
            x: Math.random() * 100 + "vw",
            y: Math.random() * 100 + "vh",
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            y: [null, Math.random() * 100 + "vh"],
            x: [null, Math.random() * 100 + "vw"],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: Math.random() * 30 + 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            width: Math.random() * 3 + 1 + "px",
            height: Math.random() * 3 + 1 + "px",
          }}
        />
      ))}
    </div>
  );
};

const DynamicBackground = () => {
  const { scrollY } = useScroll();
  
  // Opacity controls:
  // Smoke image is visible at top (0) and fades out by 800px scroll
  // Aurora effect is hidden at top (0) and fades in by 800px scroll
  const smokeOpacity = useTransform(scrollY, [0, 800], [1, 0]);
  const auroraOpacity = useTransform(scrollY, [0, 800], [0, 1]);
  const smokeScale = useTransform(scrollY, [0, 800], [1.1, 1.3]);

  // Image similar to the one provided (Orange Smoke)
  const smokeImageUrl = "https://images.unsplash.com/photo-1616712134411-6b6ae89bc3ba?q=80&w=2000&auto=format&fit=crop";

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-background overflow-hidden">
      
      {/* --- LAYER 1: AURORA LIGHT EFFECT (For sections after Home) --- */}
      <motion.div 
        style={{ opacity: auroraOpacity }}
        className="absolute inset-0 w-full h-full"
      >
          {/* Deep base gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/95 to-surfaceHighlight/20" />

          {/* Moving Tides - Layer 1 */}
          <div 
            className="absolute -top-[20%] -left-[10%] w-[80vw] h-[80vw] rounded-full bg-primary/20 blur-[100px] mix-blend-screen animate-tide-flow opacity-40"
            style={{ animationDelay: '0s' }}
          />
          
          {/* Moving Tides - Layer 2 */}
          <div 
            className="absolute top-[40%] -right-[20%] w-[70vw] h-[70vw] rounded-full bg-secondary/15 blur-[120px] mix-blend-screen animate-tide-surge opacity-30"
            style={{ animationDelay: '-5s' }}
          />
          
          {/* Aurora Pulse - Center */}
          <div 
             className="absolute top-[20%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-[90px] mix-blend-screen animate-aurora-pulse"
          />
      </motion.div>


      {/* --- LAYER 2: SMOKE IMAGE (For Home Page / Hero) --- */}
      <motion.div 
        style={{ opacity: smokeOpacity, scale: smokeScale }}
        className="absolute inset-0 w-full h-full"
      >
        <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay for text readability */}
        <img 
          src={smokeImageUrl} 
          alt="Atmospheric Background" 
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient fade at bottom to blend smoothly into the dark theme */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background to-transparent z-20" />
      </motion.div>

      {/* Noise Texture (Global) */}
      <div 
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay z-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
};

function App() {
  return (
    <PortfolioProvider>
      <div className="min-h-screen bg-background text-text selection:bg-primary/30 selection:text-white font-sans overflow-x-hidden relative">
        <CustomCursor />
        {/* ThemeSwitcher removed as per request, now in AdminDashboard */}
        <AdminDashboard />
        <AIChat />
        
        {/* New Background System */}
        <DynamicBackground />

        {/* Floating Particles for Depth */}
        <FloatingParticles />

        <div className="relative z-10">
          <main className="pb-20 pt-4 md:pt-8">
            <BentoGrid />
          </main>
        </div>
      </div>
    </PortfolioProvider>
  );
}

export default App;