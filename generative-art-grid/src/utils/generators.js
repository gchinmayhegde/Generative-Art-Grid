// src/utils/generators.js
/**
 * Implementation Notes:
 * - All generators support animation via the `time` parameter (seconds)
 * - `designerMode` boolean creates subtle, UI-friendly patterns vs vibrant art
 * - `complexity` (0-10) controls recursion depth and detail level
 * - `palette` string selects from predefined color schemes
 * - Seeded RNG ensures reproducibility for given parameters
 */

import { createRNG } from './seed.js';

// Color palettes mapped to user-friendly names
const PALETTES = {
  Warm: ["#1a1a2e", "#ff6b6b", "#ffa726", "#ffcc80", "#ffe0b2"],
  Cool: ["#0f172a", "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1"],
  Neon: ["#0a0a0a", "#ff0080", "#00ff80", "#8000ff", "#ff8000"],
  Pastel: ["#f8f9fa", "#ffb3ba", "#bae1ff", "#baffc9", "#ffffba"],
  Monochrome: ["#1f2937", "#4b5563", "#6b7280", "#9ca3af", "#d1d5db"]
};

export function generateTileSpecs(count = 12, options = {}) {
  const {
    gridCols = 4,
    palette = 'Cool',
    complexity = 4,
    designerMode = false,
    seed = null
  } = options;

  const types = ["pixel", "wave", "fractal", "diagonal", "grain"];
  const specs = [];
  
  for (let i = 0; i < count; i++) {
    const tileSeed = seed ? seed + i : Math.floor(Math.random() * 1e9);
    const type = types[i % types.length];
    
    specs.push({
      id: `${type}-${tileSeed}-${i}`,
      type,
      seed: tileSeed,
      palette,
      complexity,
      designerMode,
      label: getTypeLabel(type)
    });
  }
  
  return specs;
}

function getTypeLabel(type) {
  const labels = {
    pixel: "Pixel Noise",
    wave: "Waveform",
    fractal: "Fractal Blocks",
    diagonal: "Diagonal Strata",
    grain: "Soft Grain"
  };
  return labels[type] || type;
}

function getPalette(name) {
  return PALETTES[name] || PALETTES.Cool;
}

// ---------- Enhanced Pixel Noise ----------
export function drawPixelNoise(ctx, w, h, options = {}) {
  const {
    seed = 1,
    palette = 'Cool',
    complexity = 4,
    designerMode = false,
    time = 0
  } = options;

  const rng = createRNG(seed);
  const colors = getPalette(palette);
  const cellSize = designerMode 
    ? Math.floor(8 + complexity) 
    : Math.floor(6 + rng() * (complexity + 5));
  
  const cols = Math.ceil(w / cellSize);
  const rows = Math.ceil(h / cellSize);
  
  // Background
  ctx.fillStyle = colors[0];
  ctx.fillRect(0, 0, w, h);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const px = x * cellSize;
      const py = y * cellSize;
      
      // Animated opacity based on time and position
      const baseAlpha = designerMode ? 0.3 : 0.5;
      const animOffset = Math.sin(time * 0.5 + (x + y) * 0.2) * 0.2;
      const alpha = Math.max(0.1, baseAlpha + rng() * 0.4 + animOffset);
      
      const colorIndex = Math.floor(rng() * (colors.length - 1)) + 1;
      const color = colors[colorIndex];
      
      ctx.fillStyle = hexToRGBA(color, alpha);
      
      if (designerMode) {
        // Rounded squares for designer mode
        roundRect(ctx, px + 1, py + 1, cellSize - 2, cellSize - 2, cellSize * 0.15);
        ctx.fill();
      } else {
        ctx.fillRect(px, py, cellSize - 1, cellSize - 1);
        
        // Add depth overlay
        if (rng() > 0.8) {
          ctx.fillStyle = hexToRGBA("#000000", 0.1);
          ctx.fillRect(px + cellSize * 0.2, py + 0.2, cellSize * 0.6, cellSize * 0.6);
        }
      }
    }
  }
}

// ---------- Enhanced Waveform Lines ----------
export function drawWaveform(ctx, w, h, options = {}) {
  const {
    seed = 2,
    palette = 'Cool',
    complexity = 4,
    designerMode = false,
    time = 0
  } = options;

  const rng = createRNG(seed);
  const colors = getPalette(palette);
  
  ctx.fillStyle = colors[0];
  ctx.fillRect(0, 0, w, h);

  const lines = designerMode ? Math.max(3, complexity) : 4 + Math.floor(rng() * complexity);
  const amplitudeBase = designerMode ? 8 + complexity * 2 : 12 + rng() * (complexity * 4);

  for (let i = 0; i < lines; i++) {
    const freq = designerMode ? 0.008 + complexity * 0.001 : 0.004 + rng() * 0.02;
    const amp = amplitudeBase * (0.6 + rng() * 1.4) * (1 + i / lines * 0.5);
    const offsetY = (h / (lines + 1)) * (i + 1) + (rng() - 0.5) * (designerMode ? 15 : 30);
    const stroke = designerMode ? 1 + complexity * 0.2 : 1.2 + rng() * 3;
    
    // Animated phase shift
    const phaseShift = time * 0.3 + rng() * Math.PI * 2 + i;
    
    ctx.beginPath();
    for (let x = 0; x <= w; x++) {
      const y = offsetY + Math.sin(x * freq + phaseShift) * amp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    
    const alpha = designerMode ? 0.6 : 0.9;
    ctx.strokeStyle = hexToRGBA(colors[1 + (i % (colors.length - 1))], alpha);
    ctx.lineWidth = stroke;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();
  }

  // Soft vignette
  if (!designerMode) {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "rgba(0,0,0,0.05)");
    grad.addColorStop(0.6, "rgba(0,0,0,0)");
    grad.addColorStop(1, "rgba(0,0,0,0.15)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }
}

// ---------- Enhanced Recursive Fractal Blocks ----------
export function drawFractal(ctx, w, h, options = {}) {
  const {
    seed = 3,
    palette = 'Cool',
    complexity = 4,
    designerMode = false,
    time = 0
  } = options;

  const rng = createRNG(seed);
  const colors = getPalette(palette);
  
  ctx.fillStyle = colors[0];
  ctx.fillRect(0, 0, w, h);

  const maxDepth = Math.max(2, Math.min(6, complexity));
  
  function drawBlock(x, y, size, depth) {
    const margin = Math.max(1, Math.floor(size * 0.05));
    
    // Animated pulsing based on time and depth
    const pulseScale = designerMode ? 
      1 + Math.sin(time + depth) * 0.02 :
      1 + Math.sin(time * 0.8 + depth * 0.5) * 0.05;
    
    const actualSize = size * pulseScale;
    const alpha = designerMode ? 
      0.4 - depth * 0.05 :
      0.9 - depth * 0.08;
    
    ctx.fillStyle = hexToRGBA(colors[1 + (depth % (colors.length - 1))], alpha);
    
    const cornerRadius = designerMode ? actualSize * 0.1 : actualSize * 0.06;
    roundRect(ctx, x + margin, y + margin, actualSize - margin * 2, actualSize - margin * 2, cornerRadius);
    ctx.fill();

    if (depth <= 0 || actualSize < 20) return;
    
    const splits = designerMode ? 2 : (2 + (rng() > 0.6 ? 1 : 0));
    const threshold = designerMode ? 0.7 : 0.6;
    
    for (let sx = 0; sx < splits; sx++) {
      for (let sy = 0; sy < splits; sy++) {
        if (rng() > threshold) {
          const nx = x + (sx * actualSize) / splits;
          const ny = y + (sy * actualSize) / splits;
          const nsize = actualSize / splits;
          drawBlock(nx, ny, nsize, depth - 1);
        }
      }
    }
  }

  const size = Math.min(w, h) * (0.85 - rng() * (designerMode ? 0.1 : 0.25));
  const startX = (w - size) / 2;
  const startY = (h - size) / 2;
  drawBlock(startX, startY, size, maxDepth);
}

// ---------- NEW: Diagonal Strata ----------
export function drawDiagonalStrata(ctx, w, h, options = {}) {
  const {
    seed = 4,
    palette = 'Cool',
    complexity = 4,
    designerMode = false,
    time = 0
  } = options;

  const rng = createRNG(seed);
  const colors = getPalette(palette);
  
  ctx.fillStyle = colors[0];
  ctx.fillRect(0, 0, w, h);

  const stripes = designerMode ? complexity + 2 : 3 + Math.floor(rng() * complexity);
  const angle = designerMode ? 45 : 30 + rng() * 60; // degrees
  const stripeWidth = (Math.max(w, h) * 1.4) / stripes;

  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate((angle + Math.sin(time * 0.2) * 5) * Math.PI / 180);
  ctx.translate(-w / 2, -h / 2);

  for (let i = 0; i < stripes; i++) {
    const x = -w * 0.5 + i * stripeWidth;
    const colorIndex = 1 + (i % (colors.length - 1));
    const alpha = designerMode ? 0.2 + i * 0.1 : 0.4 + rng() * 0.4;
    
    // Create gradient for each stripe
    const grad = ctx.createLinearGradient(x, 0, x + stripeWidth, 0);
    grad.addColorStop(0, hexToRGBA(colors[colorIndex], 0));
    grad.addColorStop(0.5, hexToRGBA(colors[colorIndex], alpha));
    grad.addColorStop(1, hexToRGBA(colors[colorIndex], 0));
    
    ctx.fillStyle = grad;
    ctx.fillRect(x, -h * 0.5, stripeWidth, h * 2);
  }

  ctx.restore();
}

// ---------- NEW: Soft Grain Texture ----------
export function drawSoftGrain(ctx, w, h, options = {}) {
  const {
    seed = 5,
    palette = 'Cool',
    complexity = 4,
    designerMode = false,
    time = 0
  } = options;

  const rng = createRNG(seed);
  const colors = getPalette(palette);
  
  ctx.fillStyle = colors[0];
  ctx.fillRect(0, 0, w, h);

  const grainDensity = designerMode ? complexity * 100 : complexity * 200;
  const grainSize = designerMode ? 1 : 1 + rng() * 2;
  
  // Create grain pattern
  for (let i = 0; i < grainDensity; i++) {
    const x = rng() * w;
    const y = rng() * h;
    const colorIndex = 1 + Math.floor(rng() * (colors.length - 1));
    
    // Animated grain with subtle movement
    const animX = x + Math.sin(time * 0.5 + i * 0.1) * 2;
    const animY = y + Math.cos(time * 0.3 + i * 0.15) * 2;
    
    const alpha = designerMode ? 0.1 + rng() * 0.2 : 0.2 + rng() * 0.4;
    
    ctx.fillStyle = hexToRGBA(colors[colorIndex], alpha);
    ctx.beginPath();
    ctx.arc(animX, animY, grainSize, 0, Math.PI * 2);
    ctx.fill();
  }

  // Add subtle overlay gradient
  if (designerMode) {
    const grad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w, h) * 0.7);
    grad.addColorStop(0, "rgba(255,255,255,0.02)");
    grad.addColorStop(1, "rgba(0,0,0,0.05)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }
}

// ---------- Main draw function router ----------
export function drawPattern(ctx, w, h, type, options = {}) {
  switch (type) {
    case 'pixel':
      return drawPixelNoise(ctx, w, h, options);
    case 'wave':
      return drawWaveform(ctx, w, h, options);
    case 'fractal':
      return drawFractal(ctx, w, h, options);
    case 'diagonal':
      return drawDiagonalStrata(ctx, w, h, options);
    case 'grain':
      return drawSoftGrain(ctx, w, h, options);
    default:
      return drawPixelNoise(ctx, w, h, options);
  }
}

// ---------- Helper functions ----------
function hexToRGBA(hex, alpha = 1) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function roundRect(ctx, x, y, w, h, r) {
  r = Math.max(0, Math.min(r, w/2, h/2));
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}