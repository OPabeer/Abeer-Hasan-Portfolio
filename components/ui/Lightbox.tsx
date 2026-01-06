import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export interface LightboxContent {
  src: string;
  title?: string;
  description?: string;
  tags?: string[];
}

interface LightboxProps {
  content: LightboxContent | null;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ content, onClose }) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Reset state when content changes or closes
  useEffect(() => {
    if (!content) {
        setScale(1);
        setRotation(0);
    }
  }, [content]);

  if (!content) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 backdrop-blur-xl overflow-hidden"
        onClick={onClose}
      >
        {/* Toolbar */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-[100000] pointer-events-none">
           <span className="text-white/70 text-xs md:text-sm font-mono pointer-events-auto bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
             Scroll/Pinch to zoom • Drag to pan
           </span>
           <button
                onClick={onClose}
                className="p-3 bg-white/10 rounded-full hover:bg-white text-white hover:text-black transition-colors pointer-events-auto backdrop-blur-md border border-white/5"
            >
                <X size={24} />
            </button>
        </div>

        {/* Info Overlay */}
        {(content.title || content.description) && (
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-[100000] pointer-events-none flex justify-center">
                <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring" }}
                    className="bg-surface/80 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl max-w-3xl w-full pointer-events-auto shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-col gap-3">
                        {content.title && <h3 className="text-2xl md:text-3xl font-bold text-white">{content.title}</h3>}
                        {content.description && <p className="text-textMuted text-sm md:text-base leading-relaxed">{content.description}</p>}
                        
                        {content.tags && content.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {content.tags.map(tag => (
                                    <span key={tag} className="text-xs font-semibold px-3 py-1 bg-primary/20 text-primary rounded-full border border-primary/20">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        )}

        {/* Right Side Controls */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-[100000] pointer-events-auto" onClick={(e) => e.stopPropagation()}>
             <button onClick={() => setScale(s => Math.min(5, s + 0.5))} className="p-3 bg-black/50 border border-white/10 rounded-full text-white hover:bg-primary hover:border-primary transition-all backdrop-blur group" title="Zoom In"><ZoomIn size={24} className="group-hover:scale-110 transition-transform" /></button>
             <button onClick={() => { setScale(1); setRotation(0); }} className="p-3 bg-black/50 border border-white/10 rounded-full text-white hover:bg-primary hover:border-primary transition-all backdrop-blur group" title="Reset"><RotateCcw size={24} className="group-hover:-rotate-90 transition-transform" /></button>
             <button onClick={() => setScale(s => Math.max(0.5, s - 0.5))} className="p-3 bg-black/50 border border-white/10 rounded-full text-white hover:bg-primary hover:border-primary transition-all backdrop-blur group" title="Zoom Out"><ZoomOut size={24} className="group-hover:scale-90 transition-transform" /></button>
        </div>

        {/* Image Container */}
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: scale, rotate: rotation, opacity: 1 }}
           exit={{ scale: 0.5, opacity: 0 }}
           transition={{ type: "spring", damping: 25, stiffness: 300 }}
           className="relative cursor-grab active:cursor-grabbing w-full h-full flex items-center justify-center p-4 md:p-20 pb-40 md:pb-40"
           onClick={(e) => e.stopPropagation()}
           drag
           dragConstraints={{ left: -1000 * scale, right: 1000 * scale, top: -1000 * scale, bottom: 1000 * scale }}
           onWheel={(e) => {
              const delta = -e.deltaY * 0.001;
              setScale(s => Math.min(Math.max(0.5, s + delta), 5));
           }}
        >
          <img 
            src={content.src} 
            alt={content.title || "Preview"} 
            className="max-w-full max-h-full object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)] select-none pointer-events-none rounded-sm" 
            draggable={false}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};