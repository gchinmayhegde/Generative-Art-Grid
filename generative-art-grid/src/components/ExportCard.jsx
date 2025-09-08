// src/components/ExportCard.jsx
import React, { forwardRef } from 'react';
import { hashSeed } from '../utils/seed.js';

const ExportCard = forwardRef(({ 
  artworkRef, 
  settings = {}, // Added default empty object
  metadata = {},
  className = ""
}, ref) => {
  const {
    seed = 123456789,
    palette = 'Cool',
    complexity = 4,
    gridSize = 4,
    animationSpeed = 1.0,
    designerMode = false
  } = settings;

  const {
    patterns = ['Pixel Noise', 'Waveform', 'Fractal'],
    dateCreated = new Date().toISOString()
  } = metadata;

  // Ensure seed is always a valid number
  const validSeed = seed || 123456789;
  const seedHash = hashSeed(validSeed);
  
  const formattedDate = new Date(dateCreated).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div 
      ref={ref}
      className={`w-full max-w-2xl mx-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 ${className}`}
      style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">🎨 Generative Art Grid</h2>
          <p className="text-sm text-slate-400">Digital Collectible</p>
        </div>
        
        {/* Seed Badge */}
        <div 
          className="px-3 py-2 rounded-lg text-xs font-mono text-white"
          style={{
            background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
          }}
        >
          #{seedHash}
        </div>
      </div>

      {/* Artwork Container */}
      <div className="relative mb-6 rounded-xl overflow-hidden bg-black/20 p-4">
        <div 
          ref={artworkRef}
          className="w-full"
          style={{ aspectRatio: '1' }}
        >
          {/* Artwork content will be cloned here */}
        </div>
        
        {/* Glassmorphism overlay */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{
            background: 'linear-gradient(45deg, rgba(255,255,255,0.02), rgba(255,255,255,0.001))',
            backdropFilter: 'blur(1px)'
          }}
        />
      </div>

      {/* Metadata */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-slate-500 mb-1">PATTERN</div>
            <div className="text-sm text-white font-medium">
              {patterns.slice(0, 2).join(' + ')}
              {patterns.length > 2 && ` +${patterns.length - 2}`}
            </div>
          </div>
          
          <div>
            <div className="text-xs text-slate-500 mb-1">SEED</div>
            <div className="text-sm text-white font-mono">
              #{String(validSeed).substring(0, 8)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-slate-500 mb-1">CREATED</div>
            <div className="text-sm text-white">{formattedDate}</div>
          </div>
          
          <div>
            <div className="text-xs text-slate-500 mb-1">EDITION</div>
            <div className="text-sm text-white">1/1 Unique</div>
          </div>
        </div>

        {/* Settings Summary */}
        <div className="pt-4 border-t border-slate-700">
          <div className="text-xs text-slate-500 mb-2">GENERATION SETTINGS</div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 bg-slate-800 rounded text-slate-300">
              {gridSize}×{gridSize} Grid
            </span>
            <span className="px-2 py-1 bg-slate-800 rounded text-slate-300">
              {palette} Palette
            </span>
            <span className="px-2 py-1 bg-slate-800 rounded text-slate-300">
              Complexity {complexity}/10
            </span>
            {designerMode && (
              <span className="px-2 py-1 bg-teal-800 rounded text-teal-200">
                Designer Mode
              </span>
            )}
            <span className="px-2 py-1 bg-slate-800 rounded text-slate-300">
              {animationSpeed}x Speed
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 flex items-center justify-between text-xs text-slate-500">
          <div>Generative Art Collection</div>
          <div>v1.0</div>
        </div>
      </div>
    </div>
  );
});

ExportCard.displayName = 'ExportCard';

export default ExportCard;