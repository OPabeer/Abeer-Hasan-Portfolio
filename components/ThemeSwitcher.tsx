import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check, X } from 'lucide-react';

const PRESETS = [
  { name: 'Deep Orange', primary: '249 115 22', secondary: '253 186 116', hex: '#F97316' }, // Brighter Orange
  { name: 'Galaxy Purple', primary: '167 139 250', secondary: '56 189 248', hex: '#A78BFA' }, // Brighter Purple
  { name: 'Emerald Green', primary: '52 211 153', secondary: '110 231 183', hex: '#34D399' }, // Brighter Green
  { name: 'Crimson Red', primary: '251 113 133', secondary: '253 164 175', hex: '#FB7185' }, // Brighter Red
  { name: 'Royal Blue', primary: '96 165 250', secondary: '147 197 253', hex: '#60A5FA' }, // Brighter Blue
];

export const ThemeSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState(PRESETS[0].name);

  const applyTheme = (primary: string, secondary: string) => {
    document.documentElement.style.setProperty('--color-primary', primary);
    document.documentElement.style.setProperty('--color-secondary', secondary);
  };

  const handlePresetClick = (preset: typeof PRESETS[0]) => {
    setActiveTheme(preset.name);
    applyTheme(preset.primary, preset.secondary);
  };

  const handleCustomColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const rgb = `${r} ${g} ${b}`;
    
    // Auto-generate a lighter secondary color (simple lighten)
    const secondaryRgb = `${Math.min(r + 40, 255)} ${Math.min(g + 40, 255)} ${Math.min(b + 40, 255)}`;
    
    setActiveTheme('Custom');
    applyTheme(rgb, secondaryRgb);
  };

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col items-end">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`p-3 rounded-full shadow-2xl backdrop-blur-md transition-colors border border-white/10 ${isOpen ? 'bg-surfaceHighlight text-white' : 'bg-surface/50 text-textMuted'}`}
      >
        {isOpen ? <X size={20} /> : <Palette size={20} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="mt-4 bg-surface/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl w-64"
          >
            <h3 className="text-sm font-semibold text-white mb-3">Select Theme</h3>
            
            <div className="grid grid-cols-5 gap-2 mb-4">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handlePresetClick(preset)}
                  className="w-8 h-8 rounded-full relative flex items-center justify-center transition-transform hover:scale-110"
                  style={{ backgroundColor: preset.hex }}
                  title={preset.name}
                >
                  {activeTheme === preset.name && (
                    <Check size={14} className="text-white drop-shadow-md" />
                  )}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10">
              <label className="text-xs text-textDim flex items-center justify-between">
                <span>Custom Color</span>
                <input 
                  type="color" 
                  onChange={handleCustomColor}
                  className="w-6 h-6 rounded overflow-hidden cursor-pointer bg-transparent border-0 p-0"
                />
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};