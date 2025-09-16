
import React, { forwardRef } from 'react';
import { hashSeed } from '../utils/seed.js';

const ExportCard = forwardRef(({ 
  artworkRef, 
  settings = {},
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
      className={`w-full max-w-2xl mx-auto rounded-2xl p-8 ${className}`}
      style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
        minHeight: '600px'
      }}
      data-export-card
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', margin: '0 0 4px 0' }}>
            🎨 Generative Art Grid
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>Digital Collectible</p>
        </div>
        
        {/* Seed Badge */}
        <div 
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            fontFamily: 'monospace',
            color: 'white',
            background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
          }}
        >
          #{seedHash}
        </div>
      </div>

      {/* Artwork Container */}
      <div 
        style={{ 
          position: 'relative',
          marginBottom: '24px',
          borderRadius: '12px',
          overflow: 'hidden',
          background: 'rgba(0,0,0,0.2)',
          padding: '16px'
        }}
      >
        <div 
          ref={artworkRef}
          style={{ 
            width: '100%',
            aspectRatio: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Artwork content will be cloned here */}
        </div>
      </div>

      {/* Metadata Grid */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>PATTERN</div>
            <div style={{ fontSize: '14px', color: 'white', fontWeight: '500' }}>
              {patterns.slice(0, 2).join(' + ')}
              {patterns.length > 2 && ` +${patterns.length - 2}`}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>SEED</div>
            <div style={{ fontSize: '14px', color: 'white', fontFamily: 'monospace' }}>
              #{String(validSeed).substring(0, 8)}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>CREATED</div>
            <div style={{ fontSize: '14px', color: 'white' }}>{formattedDate}</div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>EDITION</div>
            <div style={{ fontSize: '14px', color: 'white' }}>1/1 Unique</div>
          </div>
        </div>
      </div>

      {/* Settings Summary */}
      <div style={{ paddingTop: '16px', borderTop: '1px solid #334155' }}>
        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>GENERATION SETTINGS</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '12px' }}>
          <span style={{ padding: '4px 8px', background: '#1e293b', borderRadius: '4px', color: '#cbd5e1' }}>
            {gridSize}×{gridSize} Grid
          </span>
          <span style={{ padding: '4px 8px', background: '#1e293b', borderRadius: '4px', color: '#cbd5e1' }}>
            {palette} Palette
          </span>
          <span style={{ padding: '4px 8px', background: '#1e293b', borderRadius: '4px', color: '#cbd5e1' }}>
            Complexity {complexity}/10
          </span>
          {designerMode && (
            <span style={{ padding: '4px 8px', background: '#134e4a', borderRadius: '4px', color: '#5eead4' }}>
              Designer Mode
            </span>
          )}
          <span style={{ padding: '4px 8px', background: '#1e293b', borderRadius: '4px', color: '#cbd5e1' }}>
            {animationSpeed}x Speed
          </span>
        </div>
      </div>

      {/* Footer */}
      <div 
        style={{ 
          paddingTop: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#64748b'
        }}
      >
        <div>Generative Art Collection</div>
        <div>v1.0</div>
      </div>
    </div>
  );
});

ExportCard.displayName = 'ExportCard';

export default ExportCard;