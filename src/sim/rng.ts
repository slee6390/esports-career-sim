// Mulberry32 — fast, seeded, deterministic 32-bit PRNG.
// Always pass the RNG in; never call Math.random() directly.

export type RNG = () => number  // returns [0, 1)

export function makeRng(seed: number): RNG {
  let s = seed >>> 0
  return () => {
    s += 0x6d2b79f5
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t)
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000
  }
}

export function rngInt(rng: RNG, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min
}

export function rngFloat(rng: RNG, min: number, max: number): number {
  return rng() * (max - min) + min
}

// Box-Muller approximation — used for executionVariance rolls.
export function rngNormal(rng: RNG, mu: number, sigma: number): number {
  const u1 = Math.max(rng(), 1e-10)  // guard against log(0)
  const u2 = rng()
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  return mu + sigma * z
}
