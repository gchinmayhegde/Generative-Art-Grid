// src/utils/seed.js
// Seeded RNG utilities for reproducible generation

export function createRNG(seed) {
  // Mulberry32 PRNG - fast and good quality
  let t = seed >>> 0;
  return function() {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateSeed() {
  return Math.floor(Math.random() * 1000000000); // 9-digit seed
}

export function hashSeed(seed) {
  // Create a short hash for display
  const str = seed.toString();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32-bit integer
  }
  return Math.abs(hash).toString(16).substring(0, 6).toUpperCase();
}

export function seedFromString(str) {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}