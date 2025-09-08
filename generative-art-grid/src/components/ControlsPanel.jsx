// src/components/ControlsPanel.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaRandom, FaUndo, FaEye, FaEyeSlash } from 'react-icons/fa';
import { generateSeed } from '../utils/seed.js';

const PALETTES = ['Warm', 'Cool', 'Neon', 'Pastel', 'Monochrome'];

export default function ControlsPanel({ 
  settings, 
  onSettingsChange, 
  onSurpriseMe,
  onReset,
  className = "" 
}) {
  const [localSettings, setLocalSettings] = useState(settings);

  // Debounce settings changes to avoid excessive re-renders
  useEffect(() => {
    const timer = setTimeout(() => {
      onSettingsChange(localSettings);
    }, 150);
    
    return () => clearTimeout(timer);
  }, [localSettings, onSettingsChange]);

  const handleChange = useCallback((key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const handleSurpriseMe = () => {
    const randomSettings = {
      gridSize: 2 + Math.floor(Math.random() * 7), // 2-8
      palette: PALETTES[Math.floor(Math.random() * PALETTES.length)],
      complexity: Math.floor(Math.random() * 11), // 0-10
      animationSpeed: 0.25 + Math.random() * 2.75, // 0.25-3x
      seed: generateSeed()
    };
    setLocalSettings(prev => ({ ...prev, ...randomSettings }));
    onSurpriseMe && onSurpriseMe(randomSettings);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`glass rounded-xl p-6 space-y-6 ${className}`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white/90">Controls</h3>
        <div className="flex gap-2">
          <button
            onClick={onReset}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            title="Reset to defaults"
            aria-label="Reset settings to default"
          >
            <FaUndo className="text-white/70" />
          </button>
        </div>
      </div>

      {/* Grid Size */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/80 flex items-center justify-between">
          Grid Size
          <span className="text-white/60 text-xs">{localSettings.gridSize}×{localSettings.gridSize}</span>
        </label>
        <input
          type="range"
          min="2"
          max="8"
          step="1"
          value={localSettings.gridSize}
          onChange={(e) => handleChange('gridSize', parseInt(e.target.value))}
          className="slider w-full"
          aria-label="Grid size"
        />
      </div>

      {/* Palette Selector */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-white/80">Color Palette</label>
        <div className="grid grid-cols-1 gap-2">
          {PALETTES.map(palette => (
            <label key={palette} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="palette"
                value={palette}
                checked={localSettings.palette === palette}
                onChange={(e) => handleChange('palette', e.target.value)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                localSettings.palette === palette 
                  ? 'border-indigo-400 bg-indigo-400/20' 
                  : 'border-white/30'
              }`}>
                {localSettings.palette === palette && (
                  <div className="w-2 h-2 bg-indigo-400 rounded-full m-0.5"></div>
                )}
              </div>
              <span className="text-sm text-white/80">{palette}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Pattern Complexity */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/80 flex items-center justify-between">
          Pattern Complexity
          <span className="text-white/60 text-xs">{localSettings.complexity}/10</span>
        </label>
        <input
          type="range"
          min="0"
          max="10"
          step="1"
          value={localSettings.complexity}
          onChange={(e) => handleChange('complexity', parseInt(e.target.value))}
          className="slider w-full"
          aria-label="Pattern complexity"
        />
      </div>

      {/* Animation Speed */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/80 flex items-center justify-between">
          Animation Speed
          <span className="text-white/60 text-xs">{localSettings.animationSpeed.toFixed(2)}x</span>
        </label>
        <input
          type="range"
          min="0.25"
          max="3"
          step="0.25"
          value={localSettings.animationSpeed}
          onChange={(e) => handleChange('animationSpeed', parseFloat(e.target.value))}
          className="slider w-full"
          aria-label="Animation speed"
        />
      </div>

      {/* Toggles */}
      <div className="space-y-3">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm font-medium text-white/80">Live Wallpaper</span>
          <button
            onClick={() => handleChange('isAnimating', !localSettings.isAnimating)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              localSettings.isAnimating ? 'bg-indigo-500' : 'bg-white/20'
            }`}
            aria-label="Toggle live wallpaper mode"
          >
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              localSettings.isAnimating ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm font-medium text-white/80 flex items-center gap-2">
            Designer Mode
            {localSettings.designerMode ? <FaEye className="text-xs" /> : <FaEyeSlash className="text-xs" />}
          </span>
          <button
            onClick={() => handleChange('designerMode', !localSettings.designerMode)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              localSettings.designerMode ? 'bg-teal-500' : 'bg-white/20'
            }`}
            aria-label="Toggle designer mode for UI-friendly patterns"
          >
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              localSettings.designerMode ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </label>
      </div>

      {/* Surprise Me Button */}
      <button
        onClick={handleSurpriseMe}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg btn-gradient text-white font-medium shadow-lg hover:scale-105 transition-transform"
      >
        <FaRandom /> Surprise Me
      </button>

      {/* Current Seed Display */}
      {localSettings.seed && (
        <div className="text-center">
          <div className="text-xs text-white/60 mb-1">Current Seed</div>
          <div className="text-sm font-mono text-white/80 bg-black/20 px-2 py-1 rounded">
            #{localSettings.seed.toString().substring(0, 8)}
          </div>
        </div>
      )}
    </motion.div>
  );
}