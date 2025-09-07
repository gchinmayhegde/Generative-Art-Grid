import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { drawPixelNoise, drawWaveform, drawFractal } from "../utils/generators";

const tileSize = 320; // px (canvas size)

export default function ArtTile({ spec }) {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = tileSize;
    canvas.height = tileSize;
    const ctx = canvas.getContext("2d");
    // clear
    ctx.clearRect(0, 0, tileSize, tileSize);

    // pick generator
    if (spec.type === "pixel") {
      drawPixelNoise(ctx, tileSize, tileSize, spec.seed);
    } else if (spec.type === "wave") {
      drawWaveform(ctx, tileSize, tileSize, spec.seed);
    } else if (spec.type === "fractal") {
      drawFractal(ctx, tileSize, tileSize, spec.seed);
    }
  }, [spec]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.03, boxShadow: "0 12px 30px rgba(124,58,237,0.18)" }}
      className="rounded-lg overflow-hidden border border-white/6"
      style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.02))' }}
    >
      <div className="relative">
        <canvas ref={canvasRef} className="w-full h-auto block" />
        <div className="absolute top-2 right-2 bg-black/40 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          {spec.label}
        </div>
      </div>
    </motion.div>
  );
}
