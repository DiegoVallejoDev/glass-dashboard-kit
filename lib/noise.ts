function fade(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function hash(n: number) {
  const x = Math.sin(n) * 43758.5453123;
  return x - Math.floor(x);
}

function gradient(x: number, i: number) {
  // pseudo-random sign for the integer grid point
  return hash(i) > 0.5 ? 1 : -1;
}

function perlin1D(x: number) {
  const i = Math.floor(x);
  const f = x - i;
  const g0 = gradient(x, i);
  const g1 = gradient(x, i + 1);
  const n0 = g0 * f;
  const n1 = g1 * (f - 1);
  const value = (1 - fade(f)) * n0 + fade(f) * n1;
  return Math.min(1, Math.max(0, (value + 1) / 2));
}

/**
 * Smooth, slow Perlin noise mapped to [base, base + multiplier].
 * `coordinate` can be any real number (e.g. time / slowFactor + index).
 */
export function noise(base: number, multiplier: number, coordinate?: number): number {
  const x = coordinate ?? Date.now() / 5000;
  return base + multiplier * perlin1D(x);
}
