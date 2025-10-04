// Utility functions for light curve parsing and analysis

export type LightCurvePoint = { time: number; flux: number };

// Parse a simple CSV/TXT with two numeric columns: time,flux. Skips non-numeric rows/header.
export async function parseFileData(file: File): Promise<LightCurvePoint[]> {
  const text = await file.text();
  const lines = text.split(/\r?\n/);
  const data: LightCurvePoint[] = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const parts = line.split(/[\s,;]+/).filter(Boolean);
    if (parts.length < 2) continue;
    const t = Number(parts[0]);
    const f = Number(parts[1]);
    if (Number.isFinite(t) && Number.isFinite(f)) {
      data.push({ time: t, flux: f });
    }
  }
  return data;
}

// Very simple detrending: subtract median, return copy if insufficient data
export function detrendData(data: LightCurvePoint[]): LightCurvePoint[] {
  if (!data.length) return data;
  const median = medianOf(data.map(d => d.flux));
  return data.map(d => ({ ...d, flux: d.flux - median + 1 }));
}

// Placeholder BLS: generate a synthetic period grid and a pseudo power spectrum
export function performBLS(
  data: LightCurvePoint[],
  minPeriod: number,
  maxPeriod: number,
  steps: number
): { periods: number[]; powers: number[] } {
  const n = Math.max(10, Math.min(steps || 500, 5000));
  const periods: number[] = [];
  const powers: number[] = [];
  const span = Math.max(1e-6, maxPeriod - minPeriod);
  const rms = calculateBasicStats(data).rms || 1;
  for (let i = 0; i < n; i++) {
    const p = minPeriod + (i / (n - 1)) * span;
    periods.push(p);
    // Pseudo power shaped function + some data-dependent variation
    const power = Math.abs(Math.sin(p * 0.25)) * 8 + (1 / Math.max(rms, 1e-6));
    powers.push(power);
  }
  return { periods, powers };
}

export type BestPeriod = {
  period: number;
  power: number;
  depth: number;
  snr: number;
};

export function findBestPeriods(periods: number[], powers: number[], count: number): BestPeriod[] {
  const pairs = periods.map((p, i) => ({ period: p, power: powers[i] ?? 0 }));
  pairs.sort((a, b) => b.power - a.power);
  const top = pairs.slice(0, Math.max(1, count || 5));
  return top.map((x, idx) => ({
    period: x.period,
    power: x.power,
    depth: Math.max(0.001, 0.01 * (idx + 1)),
    snr: 5 + x.power, // simple mapping
  }));
}

export type TransitStats = { snr: number; depth: number; duration: number };

export function calculateTransitStats(data: LightCurvePoint[], period: number): TransitStats {
  // Very rough placeholders based on variance and period
  const { rms } = calculateBasicStats(data);
  const depth = Math.max(0.0005, Math.min(0.05, rms * 0.5));
  const snr = Math.max(0, (depth / Math.max(rms, 1e-6)) * 10);
  const duration = Math.max(0.5, Math.min(period * 0.1, 10));
  return { snr, depth, duration };
}

export function calculateBasicStats(data: LightCurvePoint[]): { rms: number } {
  if (data.length < 2) return { rms: 0 };
  const mean = data.reduce((s, d) => s + d.flux, 0) / data.length;
  const varSum = data.reduce((s, d) => s + (d.flux - mean) ** 2, 0) / (data.length - 1);
  const rms = Math.sqrt(Math.max(0, varSum));
  return { rms };
}

function medianOf(arr: number[]): number {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
