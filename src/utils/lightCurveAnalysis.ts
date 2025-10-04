// Utility functions for light curve parsing and analysis

export type LightCurvePoint = { time: number; flux: number };

// Robustly parse CSV/TXT/DAT: supports headers, comments, various delimiters, and column detection.
export async function parseFileData(file: File): Promise<LightCurvePoint[]> {
  const text = await file.text();
  const lines = text.split(/\r?\n/);
  const data: LightCurvePoint[] = [];

  // Remove empty and comment lines
  const cleaned = lines
    .map(l => l.trim())
    .filter(l => !!l && !/^(#|;|\/\/|--)/.test(l));

  if (cleaned.length === 0) return data;

  // Detect delimiter by sampling a few lines
  const sample = cleaned.slice(0, Math.min(10, cleaned.length));
  const delimiters = [",", /\s+/, ";", "\t", "|"] as const;
  function splitWithBestDelim(line: string): string[] {
    // Try all delimiters and pick the one yielding most fields
    let best: { parts: string[]; count: number } = { parts: [line], count: 1 };
    for (const d of delimiters) {
      const parts = (typeof d === "string" ? line.split(d) : line.split(d)).map(p => p.trim()).filter(Boolean);
      if (parts.length > best.count) best = { parts, count: parts.length };
    }
    // Fallback to split on common delimiters together
    if (best.count === 1) {
      const parts = line.split(/[\s,;\t|]+/).map(p => p.trim()).filter(Boolean);
      return parts;
    }
    return best.parts;
  }

  // Decide if first non-empty line is a header (contains any letters)
  const firstParts = splitWithBestDelim(sample[0]);
  const hasHeader = firstParts.some(p => /[A-Za-z]/.test(p));
  const header = hasHeader ? firstParts.map(h => h.toLowerCase()) : [];

  // Helper to find column indices for time and flux
  const timeCandidates = ["time", "t", "jd", "hjd", "bjd", "mjd", "date", "timestamp"];
  const fluxCandidates = ["flux", "f", "rel_flux", "normalized_flux", "norm_flux", "intensity", "counts"];
  const magCandidates = ["mag", "magnitude"]; // if present, treat as flux-like but keep numeric

  let timeIdx = -1;
  let fluxIdx = -1;
  if (hasHeader) {
    timeIdx = header.findIndex(h => timeCandidates.includes(h));
    fluxIdx = header.findIndex(h => fluxCandidates.includes(h) || magCandidates.includes(h));
  }

  // Parse lines to data
  const startIdx = hasHeader ? 1 : 0;
  for (let i = startIdx; i < cleaned.length; i++) {
    const parts = splitWithBestDelim(cleaned[i]);
    if (parts.length < 2) continue;

    let tVal: number | null = null;
    let fVal: number | null = null;

    // If we know indices from header, use them
    if (timeIdx >= 0 && timeIdx < parts.length) {
      const v = Number(parts[timeIdx]);
      if (Number.isFinite(v)) tVal = v;
    }
    if (fluxIdx >= 0 && fluxIdx < parts.length) {
      const v = Number(parts[fluxIdx]);
      if (Number.isFinite(v)) fVal = v;
    }

    // Otherwise, pick first two numeric columns
    if (tVal === null || fVal === null) {
      const numerics: number[] = [];
      for (const p of parts) {
        const v = Number(p);
        if (Number.isFinite(v)) numerics.push(v);
      }
      if (numerics.length >= 2) {
        if (tVal === null) tVal = numerics[0];
        if (fVal === null) fVal = numerics[1];
      }
    }

    if (tVal !== null && fVal !== null && Number.isFinite(tVal) && Number.isFinite(fVal)) {
      data.push({ time: tVal, flux: fVal });
    }
  }

  // Sort by time and drop NaNs/duplicates
  const unique = new Map<number, number>();
  for (const d of data) {
    if (!Number.isFinite(d.time) || !Number.isFinite(d.flux)) continue;
    unique.set(d.time, d.flux);
  }
  const out = Array.from(unique.entries())
    .map(([time, flux]) => ({ time, flux }))
    .sort((a, b) => a.time - b.time);

  return out;
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
