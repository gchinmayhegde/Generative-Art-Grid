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
    pixel: "Moving Lights",
    wave: "Waveform",
    fractal: "Light Rays",
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
  
  // Background
  ctx.fillStyle = colors[0];
  ctx.fillRect(0, 0, w, h);

  // Create multiple light sources
  const lightCount = designerMode ? 2 + complexity : 3 + Math.floor(rng() * complexity);
  
  for (let i = 0; i < lightCount; i++) {
    // Light source movement
    const baseX = (rng() * 0.6 + 0.2) * w; // Keep lights within center 60%
    const baseY = (rng() * 0.6 + 0.2) * h;
    
    // Smooth circular movement
    const radius = designerMode ? 20 + complexity * 5 : 30 + rng() * 50;
    const speed = designerMode ? 0.3 : 0.2 + rng() * 0.4;
    const phase = rng() * Math.PI * 2;
    
    const lightX = baseX + Math.cos(time * speed + phase + i) * radius;
    const lightY = baseY + Math.sin(time * speed * 0.7 + phase + i * 1.3) * radius;
    
    // Light properties
    const maxRadius = designerMode ? 80 + complexity * 10 : 100 + rng() * 80;
    const intensity = designerMode ? 0.3 : 0.4 + rng() * 0.3;
    const colorIndex = 1 + (i % (colors.length - 1));
    
    // Create radial gradient for light
    const gradient = ctx.createRadialGradient(
      lightX, lightY, 0,
      lightX, lightY, maxRadius
    );
    
    // Inner glow
    gradient.addColorStop(0, hexToRGBA(colors[colorIndex], intensity));
    gradient.addColorStop(0.3, hexToRGBA(colors[colorIndex], intensity * 0.6));
    gradient.addColorStop(0.6, hexToRGBA(colors[colorIndex], intensity * 0.2));
    gradient.addColorStop(1, hexToRGBA(colors[colorIndex], 0));
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    
    // Add core light spot
    const coreGradient = ctx.createRadialGradient(
      lightX, lightY, 0,
      lightX, lightY, maxRadius * 0.2
    );
    
    coreGradient.addColorStop(0, hexToRGBA("#ffffff", intensity * 0.3));
    coreGradient.addColorStop(0.5, hexToRGBA(colors[colorIndex], intensity * 0.5));
    coreGradient.addColorStop(1, hexToRGBA(colors[colorIndex], 0));
    
    ctx.fillStyle = coreGradient;
    ctx.fillRect(0, 0, w, h);
  }
  
  // Add subtle ambient particles for extra movement
  if (!designerMode) {
    const particleCount = 20 + complexity * 5;
    for (let i = 0; i < particleCount; i++) {
      const px = (rng() * w + Math.sin(time * 0.5 + i) * 20) % w;
      const py = (rng() * h + Math.cos(time * 0.3 + i) * 15) % h;
      const size = 1 + rng() * 2;
      const alpha = 0.1 + Math.sin(time + i) * 0.05;
      
      ctx.fillStyle = hexToRGBA(colors[1 + (i % (colors.length - 1))], alpha);
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
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

// ---------- Enhanced Cursor Animations ----------

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
  
  // Background
  ctx.fillStyle = colors[0];
  ctx.fillRect(0, 0, w, h);

  // Light ray parameters
  const rayCount = designerMode ? 1 + Math.floor(complexity / 3) : 1 + Math.floor(rng() * 3);
  
  for (let r = 0; r < rayCount; r++) {
    // Ray movement - simulates following cursor/interaction
    const centerX = w * 0.5;
    const centerY = h * 0.5;
    
    // Create smooth movement pattern that simulates user interaction
    const targetX = centerX + Math.sin(time * 0.8 + r * 2) * (w * 0.3);
    const targetY = centerY + Math.cos(time * 0.6 + r * 1.5) * (h * 0.3);
    
    // Ray properties
    const rayLength = designerMode ? 80 + complexity * 10 : 100 + rng() * 60;
    const rayWidth = designerMode ? 3 + complexity : 4 + rng() * 6;
    const intensity = designerMode ? 0.6 : 0.7 + rng() * 0.3;
    
    // Calculate ray angle (pointing toward target)
    const angle = Math.atan2(targetY - centerY, targetX - centerX);
    
    // Ray start and end points
    const startX = centerX - Math.cos(angle) * rayLength * 0.5;
    const startY = centerY - Math.sin(angle) * rayLength * 0.5;
    const endX = centerX + Math.cos(angle) * rayLength * 0.5;
    const endY = centerY + Math.sin(angle) * rayLength * 0.5;
    
    // Create linear gradient along the ray
    const rayGradient = ctx.createLinearGradient(startX, startY, endX, endY);
    const colorIndex = 1 + (r % (colors.length - 1));
    
    rayGradient.addColorStop(0, hexToRGBA(colors[colorIndex], 0));
    rayGradient.addColorStop(0.3, hexToRGBA(colors[colorIndex], intensity * 0.8));
    rayGradient.addColorStop(0.7, hexToRGBA(colors[colorIndex], intensity));
    rayGradient.addColorStop(1, hexToRGBA(colors[colorIndex], 0));
    
    // Draw main ray
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    
    // Create ray shape with rounded ends
    ctx.beginPath();
    ctx.ellipse(0, 0, rayLength * 0.5, rayWidth * 0.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = rayGradient;
    ctx.fill();
    
    // Add bright core
    ctx.beginPath();
    ctx.ellipse(0, 0, rayLength * 0.5, rayWidth * 0.2, 0, 0, Math.PI * 2);
    ctx.fillStyle = hexToRGBA("#ffffff", intensity * 0.4);
    ctx.fill();
    
    ctx.restore();
    
    // Add glow effect around the ray
    const glowGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, rayLength * 0.8
    );
    glowGradient.addColorStop(0, hexToRGBA(colors[colorIndex], intensity * 0.2));
    glowGradient.addColorStop(0.5, hexToRGBA(colors[colorIndex], intensity * 0.1));
    glowGradient.addColorStop(1, hexToRGBA(colors[colorIndex], 0));
    
    ctx.fillStyle = glowGradient;
    ctx.fillRect(0, 0, w, h);
    
    // Add interaction point (where ray is "pointing")
    const pulseRadius = 8 + Math.sin(time * 3 + r) * 4;
    const pointGradient = ctx.createRadialGradient(
      targetX, targetY, 0,
      targetX, targetY, pulseRadius
    );
    pointGradient.addColorStop(0, hexToRGBA("#ffffff", 0.8));
    pointGradient.addColorStop(0.3, hexToRGBA(colors[colorIndex], 0.6));
    pointGradient.addColorStop(1, hexToRGBA(colors[colorIndex], 0));
    
    ctx.fillStyle = pointGradient;
    ctx.fillRect(0, 0, w, h);
  }
  
  // Add subtle connecting particles
  if (!designerMode && complexity > 5) {
    for (let i = 0; i < 8; i++) {
      const px = w * 0.5 + Math.sin(time + i * 0.8) * 40;
      const py = h * 0.5 + Math.cos(time * 0.8 + i) * 40;
      const size = 2 + Math.sin(time * 2 + i) * 1;
      
      ctx.fillStyle = hexToRGBA(colors[2], 0.3);
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
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