// Utility functions for light curve parsing and analysis

export type LightCurvePoint = { time: number; flux: number };

// Robustly parse CSV/TXT/DAT: supports headers, comments, various delimiters, and column detection.
export async function parseFileData(file: File): Promise<LightCurvePoint[]> {
  const text = await file.text();
  const lines = text
    // Normalize BOM
    .replace(/^\uFEFF/, '')
    // Normalize non-breaking and thin spaces to regular space
    .replace(/[\u00A0\u2000-\u200B\u202F\u205F\u3000]/g, ' ')
    .split(/\r?\n/);
  const data: LightCurvePoint[] = [];

  // Remove empty and comment lines
  const cleaned = lines
    .map(l => l.replace(/[\u00A0\u2000-\u200B\u202F\u205F\u3000]/g, ' ').trim())
    .filter(l => !!l && !/^(#|;|\/\/|--)/.test(l));

  if (cleaned.length === 0) return data;

  // Detect delimiter by sampling a few lines
  const sample = cleaned.slice(0, Math.min(10, cleaned.length));
  const delimiters = [",", /\s+/, ";", "\t", "|"] as const;
  function stripInlineComments(line: string): string {
    // Remove trailing inline comments starting with #, //, ;, --
    // but keep delimiters between values
    let s = line;
    // Remove // comments
    s = s.replace(/\s\/\/.*$/, "");
    // Remove # comments
    s = s.replace(/\s#.*$/, "");
    // Remove ; comments (when used as comment, not delimiter). If line contains semicolons as delimiters,
    // this may be aggressive; we only strip when semicolon followed by space or start of comment-like text.
    s = s.replace(/\s;\s.*$/, "");
    // Remove -- comments
    s = s.replace(/\s--.*$/, "");
    return s.trim();
  }
  function splitWithBestDelim(line: string): string[] {
    // Try all delimiters and pick the one yielding most fields
    const base = stripInlineComments(line);
    let best: { parts: string[]; count: number } = { parts: [base], count: 1 };
    for (const d of delimiters) {
      const parts = (typeof d === "string" ? base.split(d) : base.split(d)).map(p => p.trim()).filter(Boolean);
      if (parts.length > best.count) best = { parts, count: parts.length };
    }
    // Fallback to split on common delimiters together
    if (best.count === 1) {
      const parts = base.split(/[\s,;\t|]+/).map(p => p.trim()).filter(Boolean);
      return parts;
    }
    return best.parts;
  }

  // Flexible number parser: supports thousand separators and decimal commas
  function parseFlexibleNumber(token: string): number {
    let t = token.replace(/["'`]/g, "").trim();
    // Convert Arabic-Indic digits to ASCII
    t = t.replace(/[\u0660-\u0669\u06F0-\u06F9]/g, (d) => {
      const code = d.charCodeAt(0);
      const zero = code >= 0x06F0 ? 0x06F0 : 0x0660;
      return String.fromCharCode('0'.charCodeAt(0) + (code - zero));
    });
    // Normalize various dashes to ASCII hyphen-minus
    t = t.replace(/[\u2010-\u2015\u2212]/g, '-');
    // Handle Arabic thousands separator (\u066C) and decimal separator (\u066B)
    t = t.replace(/\u066C/g, ',').replace(/\u066B/g, '.');
    // Strip uncertainty suffixes like "+/- ..." or "± ..."
    t = t.replace(/\s*(±|\+\/-|\+\/−|\+\/\-|\+\/)\s*.*$/, "").trim();
    // Remove trailing percentage sign
    t = t.replace(/%$/, '').trim();
    // Remove inline unit in parentheses e.g., 2457000.1 (JD)
    t = t.replace(/\([^)]*\)$/g, "").trim();
    // If looks like 1,234 or 1,234.56 (thousands), drop grouping commas
    if (/^[+-]?\d{1,3}(,\d{3})+(\.\d+)?$/.test(t)) {
      t = t.replace(/,/g, "");
    }
    // If looks like decimal comma (e.g., 1234,56) and no dot present
    if (/^[+-]?\d+(,\d+)$/.test(t) && !t.includes('.')) {
      t = t.replace(',', '.');
    }
    // If both dot and comma exist and comma appears after dot, assume comma decimal and dot thousand
    if (t.includes(',') && t.includes('.')) {
      const lastComma = t.lastIndexOf(',');
      const lastDot = t.lastIndexOf('.');
      if (lastComma > lastDot) {
        t = t.replace(/\./g, '').replace(',', '.');
      }
    }
    // Scientific notation with comma decimal (e.g., 1,23e-3)
    if (/^[+-]?\d+(,\d+)[eE][+-]?\d+$/.test(t)) {
      t = t.replace(',', '.');
    }
    let v = Number(t);
    // Attempt date/time parsing if still NaN and it looks like a date/time
    if (!Number.isFinite(v) && /[:\-T/]/.test(t)) {
      const ms = Date.parse(t);
      if (Number.isFinite(ms)) {
        // Convert to days since epoch for scale comparable to typical light curves
        v = ms / (1000 * 60 * 60 * 24);
      }
    }
    return Number.isFinite(v) ? v : NaN;
  }

  // Decide if first non-empty line is a header (contains any letters)
  const firstParts = splitWithBestDelim(sample[0]);
  const hasHeader = firstParts.some(p => /\p{L}/u.test(p));
  const header = hasHeader ? firstParts.map(h => h.toLowerCase()) : [];

  // Helper to find column indices for time and flux
  const timeCandidates = [
    "time", "t", "jd", "hjd", "bjd", "mjd", "date", "timestamp",
    // Arabic common variants
    "الوقت", "زمن", "تاريخ", "التاريخ"
  ];
  const fluxCandidates = [
    "flux", "f", "rel_flux", "normalized_flux", "norm_flux", "intensity", "counts",
    // Arabic common variants
    "تدفق", "السطوع", "سطوع", "شدة", "اللمعان", "لمعان"
  ];
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
      const v = parseFlexibleNumber(parts[timeIdx]);
      if (Number.isFinite(v)) tVal = v;
    }
    if (fluxIdx >= 0 && fluxIdx < parts.length) {
      const v = parseFlexibleNumber(parts[fluxIdx]);
      if (Number.isFinite(v)) fVal = v;
    }

    // Otherwise, pick first two numeric columns
    if (tVal === null || fVal === null) {
      const numerics: number[] = [];
      for (const p of parts) {
        const v = parseFlexibleNumber(p);
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

  // If initial pass failed to find enough rows, attempt dataset-wide column detection
  if (data.length < 2) {
    const rows: number[][] = [];
    for (let i = startIdx; i < cleaned.length; i++) {
      const parts = splitWithBestDelim(cleaned[i]);
      const nums = parts.map(parseFlexibleNumber);
      rows.push(nums);
    }
    // Determine numeric columns: index j is numeric if >=60% entries are finite
    const maxCols = rows.reduce((m, r) => Math.max(m, r.length), 0);
    const numericCols: number[] = [];
    for (let j = 0; j < maxCols; j++) {
      let count = 0, total = 0;
      for (const r of rows) { total++; if (Number.isFinite(r[j])) count++; }
      if (total > 0 && count / total >= 0.6) numericCols.push(j);
    }
    // Score time candidates: monotonic increase ratio
    function monotonicScore(col: number): number {
      let inc = 0, cmp = 0;
      let prev = -Infinity;
      for (const r of rows) {
        const v = r[col];
        if (!Number.isFinite(v)) continue;
        if (cmp > 0 && v > prev) inc++;
        prev = v; cmp++;
      }
      return cmp > 1 ? inc / (cmp - 1) : 0;
    }
    const timeScores = numericCols.map(c => ({ c, s: monotonicScore(c) }));
    timeScores.sort((a, b) => b.s - a.s);
    const chosenTime = timeScores[0]?.s && timeScores[0].s >= 0.6 ? timeScores[0].c : undefined;

    // Score flux candidates: variance
    function varianceOf(col: number): number {
      const vals = rows.map(r => r[col]).filter(Number.isFinite) as number[];
      if (vals.length < 2) return 0;
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
      const v = vals.reduce((s, x) => s + (x - mean) ** 2, 0) / (vals.length - 1);
      return v;
    }
    const fluxScores = numericCols
      .filter(c => c !== chosenTime)
      .map(c => ({ c, v: varianceOf(c) }))
      .sort((a, b) => b.v - a.v);
    const chosenFlux = fluxScores[0]?.c;

    if (chosenFlux !== undefined) {
      // Build data using chosen columns; if no valid time, use index
      let idx = 0;
      for (const r of rows) {
        const t = chosenTime !== undefined && Number.isFinite(r[chosenTime]) ? (r[chosenTime] as number) : idx;
        const f = r[chosenFlux];
        if (Number.isFinite(t) && Number.isFinite(f)) {
          data.push({ time: t as number, flux: f as number });
          idx++;
        }
      }
    } else {
      // Last resort: single numeric column as flux, index as time
      // Find any column with many finite values
      const fallbackCol = numericCols[0];
      if (fallbackCol !== undefined) {
        let idx = 0;
        for (const r of rows) {
          const f = r[fallbackCol];
          if (Number.isFinite(f)) {
            data.push({ time: idx++, flux: f as number });
          }
        }
      }
    }
  }

  // Sort by time and drop NaNs/duplicates
  const unique = new Map<number, number>();
  for (const d of data) {
    if (!Number.isFinite(d.time) || !Number.isFinite(d.flux)) continue;
    unique.set(d.time, d.flux);
  }
  let out = Array.from(unique.entries())
    .map(([time, flux]) => ({ time, flux }))
    .sort((a, b) => a.time - b.time);

  // Final fallback: extract any numeric tokens across the file
  if (out.length < 2) {
    const values: number[] = [];
    for (const line of cleaned) {
      const parts = splitWithBestDelim(line);
      for (const p of parts) {
        const v = parseFlexibleNumber(p);
        if (Number.isFinite(v)) values.push(v as number);
      }
    }
    if (values.length >= 2) {
      out = values.map((v, i) => ({ time: i, flux: v }));
    }
  }

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
