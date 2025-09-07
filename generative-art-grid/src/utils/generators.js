// utils/generators.js
// Exports:
//  - generateTileSpecs(count)
//  - drawPixelNoise(ctx, w, h, seed)
//  - drawWaveform(ctx, w, h, seed)
//  - drawFractal(ctx, w, h, seed)

function createRNG(seed) {
  // Mulberry32
  let t = seed >>> 0;
  return function () {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function pickPalette(rng) {
  // simple palettes
  const palettes = [
    ["#111827", "#06b6d4", "#7c3aed", "#f0abfc", "#fde68a"],
    ["#061123", "#0ea5a4", "#7dd3fc", "#60a5fa", "#a78bfa"],
    ["#0b132b", "#ffb4a2", "#ffcad4", "#ffd6a5", "#bde0fe"],
    ["#001219", "#005f73", "#0a9396", "#94d2bd", "#ee9b00"],
    ["#0f172a", "#ff6b6b", "#ffd166", "#06d6a0", "#118ab2"]
  ];
  return palettes[Math.floor(rng() * palettes.length)];
}

export function generateTileSpecs(count = 12) {
  const types = ["pixel", "wave", "fractal"];
  const specs = [];
  for (let i = 0; i < count; i++) {
    const seed = Math.floor(Math.random() * 1e9);
    const type = types[i % types.length];
    specs.push({
      id: `${type}-${seed}-${i}`,
      type,
      seed,
      label: type === "pixel" ? "Pixel Noise" : type === "wave" ? "Waveform" : "Fractal"
    });
  }
  return specs;
}

// ---------- Pixel Noise ----------
export function drawPixelNoise(ctx, w, h, seed = 1) {
  const rng = createRNG(seed);
  const palette = pickPalette(rng);
  const cellSize = Math.floor(6 + rng() * 14); // size of block
  const cols = Math.ceil(w / cellSize);
  const rows = Math.ceil(h / cellSize);
  // background
  ctx.fillStyle = palette[0];
  ctx.fillRect(0, 0, w, h);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const px = x * cellSize;
      const py = y * cellSize;
      const alpha = 0.5 + rng() * 0.6;
      const color = palette[Math.floor(rng() * (palette.length - 1)) + 1];
      ctx.fillStyle = hexToRGBA(color, alpha);
      ctx.fillRect(px, py, cellSize - 1, cellSize - 1);
      // small overlay for depth
      if (rng() > 0.85) {
        ctx.fillStyle = hexToRGBA("#000000", 0.08);
        ctx.fillRect(px + cellSize * 0.15, py + cellSize * 0.15, cellSize * 0.7, cellSize * 0.7);
      }
    }
  }
}

// ---------- Waveform Lines ----------
export function drawWaveform(ctx, w, h, seed = 2) {
  const rng = createRNG(seed);
  const palette = pickPalette(rng);
  ctx.fillStyle = palette[0];
  ctx.fillRect(0, 0, w, h);

  const lines = 6 + Math.floor(rng() * 8);
  const amplitudeBase = 12 + rng() * 36;

  for (let i = 0; i < lines; i++) {
    const freq = 0.004 + rng() * 0.02;
    const amp = amplitudeBase * (0.6 + rng() * 1.4) * (1 + i / lines * 0.5);
    const offsetY = (h / (lines + 1)) * (i + 1) + (rng() - 0.5) * 30;
    const stroke = 1.2 + rng() * 3.0;
    ctx.beginPath();
    for (let x = 0; x <= w; x++) {
      const y = offsetY + Math.sin(x * freq + rng() * Math.PI * 2 + i) * amp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = hexToRGBA(palette[1 + (i % (palette.length - 1))], 0.9);
    ctx.lineWidth = stroke;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();
  }

  // soft vignette
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "rgba(0,0,0,0.05)");
  grad.addColorStop(0.6, "rgba(0,0,0,0)");
  grad.addColorStop(1, "rgba(0,0,0,0.15)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

// ---------- Recursive Fractal Blocks ----------
export function drawFractal(ctx, w, h, seed = 3) {
  const rng = createRNG(seed);
  const palette = pickPalette(rng);
  ctx.fillStyle = palette[0];
  ctx.fillRect(0, 0, w, h);

  const maxDepth = 4 + Math.floor(rng() * 3);

  function drawBlock(x, y, size, depth) {
    const margin = Math.max(2, Math.floor(size * 0.05));
    // fill
    ctx.fillStyle = hexToRGBA(palette[1 + (depth % (palette.length - 1))], 0.9 - depth * 0.08);
    roundRect(ctx, x + margin, y + margin, size - margin * 2, size - margin * 2, size * 0.06);
    ctx.fill();

    if (depth <= 0 || size < 20) return;
    const splits = 2 + (rng() > 0.6 ? 1 : 0);
    for (let sx = 0; sx < splits; sx++) {
      for (let sy = 0; sy < splits; sy++) {
        if (rng() > 0.6) {
          const nx = x + (sx * size) / splits;
          const ny = y + (sy * size) / splits;
          const nsize = size / splits;
          drawBlock(nx, ny, nsize, depth - 1);
        }
      }
    }
  }

  // start at centered square
  const size = Math.min(w, h) * (0.9 - rng() * 0.25);
  const startX = (w - size) / 2;
  const startY = (h - size) / 2;
  drawBlock(startX, startY, size, maxDepth);
}

// ----------------- helpers -----------------
function hexToRGBA(hex, alpha = 1) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function roundRect(ctx, x, y, w, h, r) {
  r = Math.max(0, r);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export default {
  generateTileSpecs,
  drawPixelNoise,
  drawWaveform,
  drawFractal
};
