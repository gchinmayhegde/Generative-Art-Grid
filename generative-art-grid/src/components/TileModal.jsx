// src/components/TileModal.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPlay, FaPause, FaDownload, FaCopy } from 'react-icons/fa';
import { drawPattern } from '../utils/generators';
import { useAnimationLoop } from '../hooks/useAnimationLoop';
import { hashSeed } from '../utils/seed.js';
import html2canvas from 'html2canvas';

export default function TileModal({ spec, isOpen, onClose, globalAnimationSpeed = 1.0 }) {
  const canvasRef = useRef();
  const [localAnimating, setLocalAnimating] = useState(true);
  const [localSpeed, setLocalSpeed] = useState(globalAnimationSpeed);
  const [localComplexity, setLocalComplexity] = useState(spec?.complexity || 4);
  const [copying, setCopying] = useState(false);
  const [exporting, setExporting] = useState(false);
  
  const { time } = useAnimationLoop(localAnimating, localSpeed);

  const drawTile = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !spec) return;
    
    // Use larger canvas for modal view
    const size = 600;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    
    ctx.clearRect(0, 0, size, size);

    const options = {
      seed: spec.seed,
      palette: spec.palette || 'Cool',
      complexity: localComplexity,
      designerMode: spec.designerMode || false,
      time: time
    };

    drawPattern(ctx, size, size, spec.type, options);
  }, [spec, time, localComplexity]);

  useEffect(() => {
    if (isOpen) {
      drawTile();
    }
  }, [drawTile, isOpen]);

  const handleExport = async () => {
    if (!canvasRef.current) return;
    setExporting(true);
    
    try {
      // Create a temporary container for export
      const exportContainer = document.createElement('div');
      exportContainer.style.position = 'absolute';
      exportContainer.style.left = '-9999px';
      exportContainer.style.background = '#0f172a';
      exportContainer.style.padding = '20px';
      exportContainer.style.borderRadius = '12px';
      
      // Clone the canvas
      const clonedCanvas = canvasRef.current.cloneNode(true);
      clonedCanvas.getContext('2d').drawImage(canvasRef.current, 0, 0);
      
      exportContainer.appendChild(clonedCanvas);
      document.body.appendChild(exportContainer);
      
      const canvas = await html2canvas(exportContainer, { 
        scale: 2, 
        useCORS: true,
        backgroundColor: '#0f172a'
      });
      
      document.body.removeChild(exportContainer);
      
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `generative-art-${spec.type}-${spec.seed}-${new Date().toISOString().slice(0,10)}.png`;
      a.click();
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export artwork.');
    }
    
    setExporting(false);
  };

  const handleCopySeed = async () => {
    setCopying(true);
    try {
      await navigator.clipboard.writeText(spec.seed.toString());
      setTimeout(() => setCopying(false), 1000);
    } catch (err) {
      console.error('Copy failed:', err);
      setCopying(false);
    }
  };

  if (!spec) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.9)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="glass rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">{spec.label}</h2>
                <div className="flex items-center gap-4 text-sm text-white/60 mt-1">
                  <span>Seed: #{hashSeed(spec.seed)}</span>
                  <span>•</span>
                  <span>{spec.palette} Palette</span>
                  <span>•</span>
                  <span>Complexity {localComplexity}/10</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <FaTimes className="text-white/80" />
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Canvas */}
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden bg-black/20">
                  <canvas 
                    ref={canvasRef} 
                    className="w-full h-auto block rounded-lg"
                  />
                  
                  {localAnimating && (
                    <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      Live {localSpeed.toFixed(1)}x
                    </div>
                  )}
                </div>

                {/* Canvas Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setLocalAnimating(!localAnimating)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg glass hover:bg-white/10 transition-colors"
                    >
                      {localAnimating ? <FaPause /> : <FaPlay />}
                      {localAnimating ? 'Pause' : 'Play'}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopySeed}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg glass hover:bg-white/10 transition-colors text-sm"
                      disabled={copying}
                    >
                      <FaCopy />
                      {copying ? 'Copied!' : 'Copy Seed'}
                    </button>
                    
                    <button
                      onClick={handleExport}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg btn-gradient text-white hover:scale-105 transition-transform"
                      disabled={exporting}
                    >
                      <FaDownload />
                      {exporting ? 'Exporting...' : 'Export PNG'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Interactive Controls */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Interactive Controls</h3>
                  
                  {/* Local Complexity */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white/80 flex items-center justify-between">
                      Pattern Complexity
                      <span className="text-white/60 text-xs">{localComplexity}/10</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      value={localComplexity}
                      onChange={(e) => setLocalComplexity(parseInt(e.target.value))}
                      className="slider w-full"
                    />
                  </div>

                  {/* Local Animation Speed */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white/80 flex items-center justify-between">
                      Animation Speed
                      <span className="text-white/60 text-xs">{localSpeed.toFixed(2)}x</span>
                    </label>
                    <input
                      type="range"
                      min="0.25"
                      max="3"
                      step="0.25"
                      value={localSpeed}
                      onChange={(e) => setLocalSpeed(parseFloat(e.target.value))}
                      className="slider w-full"
                    />
                  </div>
                </div>

                {/* Pattern Info */}
                <div className="space-y-3">
                  <h4 className="text-md font-semibold text-white">Pattern Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Type:</span>
                      <span className="text-white">{spec.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Full Seed:</span>
                      <span className="text-white font-mono text-xs">{spec.seed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Palette:</span>
                      <span className="text-white">{spec.palette}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Mode:</span>
                      <span className="text-white">{spec.designerMode ? 'Designer' : 'Art'}</span>
                    </div>
                  </div>
                </div>

                {/* Usage Tips */}
                <div className="bg-black/20 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-white mb-2">💡 Tips</h4>
                  <ul className="text-xs text-white/70 space-y-1">
                    <li>• Adjust complexity to see pattern variations</li>
                    <li>• Try different speeds for unique animations</li>
                    <li>• Copy the seed to recreate this exact pattern</li>
                    <li>• Export creates a high-resolution PNG</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}