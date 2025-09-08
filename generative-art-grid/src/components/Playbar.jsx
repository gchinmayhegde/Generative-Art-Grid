
import React from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaForward, FaBackward } from 'react-icons/fa';

export default function Playbar({ 
  isPlaying,
  onTogglePlay,
  animationSpeed = 1.0,
  onSpeedChange,
  className = ""
}) {
  const handleSpeedChange = (delta) => {
    const newSpeed = Math.max(0.25, Math.min(3, animationSpeed + delta));
    onSpeedChange(newSpeed);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-4 ${className}`}
    >
      {/* Speed Down */}
      <button
        onClick={() => handleSpeedChange(-0.25)}
        disabled={animationSpeed <= 0.25}
        className="p-2 rounded-lg glass hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Decrease speed"
        aria-label="Decrease animation speed"
      >
        <FaBackward className="text-white/80 text-sm" />
      </button>

      {/* Play/Pause */}
      <button
        onClick={onTogglePlay}
        className="p-3 rounded-lg btn-gradient hover:scale-105 transition-transform shadow-lg"
        title={isPlaying ? "Pause animation" : "Play animation"}
        aria-label={isPlaying ? "Pause animation" : "Play animation"}
      >
        {isPlaying ? (
          <FaPause className="text-white text-lg" />
        ) : (
          <FaPlay className="text-white text-lg ml-0.5" />
        )}
      </button>

      {/* Speed Up */}
      <button
        onClick={() => handleSpeedChange(0.25)}
        disabled={animationSpeed >= 3}
        className="p-2 rounded-lg glass hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Increase speed"
        aria-label="Increase animation speed"
      >
        <FaForward className="text-white/80 text-sm" />
      </button>

      {/* Speed Display */}
      <div className="flex flex-col items-center">
        <div className="text-xs text-white/60">Speed</div>
        <div className="text-sm font-mono text-white/80">{animationSpeed.toFixed(2)}x</div>
      </div>

      {/* Animation Status */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/20">
        <div className={`w-2 h-2 rounded-full ${
          isPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
        }`}></div>
        <span className="text-xs text-white/70">
          {isPlaying ? 'Live' : 'Paused'}
        </span>
      </div>
    </motion.div>
  );
}