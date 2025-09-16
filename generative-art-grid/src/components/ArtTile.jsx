
import React, { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { drawPattern } from "../utils/generators";
import { useAnimationLoop } from "../hooks/useAnimationLoop";

const tileSize = 320; // px (canvas size)

export default function ArtTile({ 
  spec, 
  isAnimating = false, 
  animationSpeed = 1.0,
  onClick,
  className = ""
}) {
  const canvasRef = useRef();
  const { time } = useAnimationLoop(isAnimating, animationSpeed);

  const drawTile = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = tileSize;
    canvas.height = tileSize;
    const ctx = canvas.getContext("2d");
    
    // Clear canvas
    ctx.clearRect(0, 0, tileSize, tileSize);

    // Draw pattern with current options
    const options = {
      seed: spec.seed,
      palette: spec.palette || 'Cool',
      complexity: spec.complexity || 4,
      designerMode: spec.designerMode || false,
      time: time
    };

    drawPattern(ctx, tileSize, tileSize, spec.type, options);
  }, [spec, time]);

  // Redraw when spec changes or time updates (for animation)
  useEffect(() => {
    drawTile();
  }, [drawTile]);

  const handleClick = () => {
    if (onClick) {
      onClick(spec);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ 
        scale: 1.03, 
        boxShadow: "0 12px 30px rgba(124,58,237,0.18)",
        transition: { duration: 0.2 }
      }}
      onClick={handleClick}
      className={`rounded-lg overflow-hidden border border-white/6 cursor-pointer ${className}`}
      style={{ 
        background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.02))',
      }}
    >
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          className="w-full h-auto block"
          style={{ aspectRatio: '1' }}
        />
        
        {/* Tile Label */}
        <div className="absolute top-2 right-2 bg-black/40 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          {spec.label}
        </div>
        
        {/* Animation Indicator */}
        {isAnimating && (
          <motion.div 
            className="absolute top-2 left-2 w-2 h-2 bg-green-400 rounded-full"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}

        {/* Designer Mode Indicator */}
        {spec.designerMode && (
          <div className="absolute bottom-2 left-2 bg-teal-500/80 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
            Designer
          </div>
        )}

        {/* Hover Overlay */}
        <motion.div 
          className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
          whileHover={{ opacity: 1 }}
        >
          <div className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded backdrop-blur-sm">
            Click to expand
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}