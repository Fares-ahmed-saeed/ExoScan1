// Basic exoplanet calculation helpers (placeholder implementations)
// Units are approximate and simplified for demo purposes.

export type DetectionQuality = {
  snr: number;
  depth: number;
  period: number;
  dataPoints: number;
  duration: number;
};

// Estimate radius relative to Earth's radii from transit depth (fractional)
export function calculatePlanetRadius(depth: number): number {
  // depth ~= (Rp/Rs)^2. Assume solar-like star radius = 1 Rsun.
  // Convert to Earth radii roughly: 1 Rsun ~ 109 Re
  const rp_over_rs = Math.sqrt(Math.max(0, depth));
  const rp_in_rsun = rp_over_rs * 1; // Rsun
  const rp_in_re = rp_in_rsun * 109;
  return Number.isFinite(rp_in_re) ? rp_in_re : 0;
}

// Semi-major axis in AU from period (days) assuming 1 Msun using Kepler's third law
export function calculateSemiMajorAxis(periodDays: number): number {
  const P_years = Math.max(1e-6, periodDays) / 365.25;
  // For 1 Msun, a^3 ~ P^2  =>  a ~ P^(2/3)
  const a_au = Math.pow(P_years * P_years, 1 / 3);
  return Number.isFinite(a_au) ? a_au : 0;
}

// Equilibrium temperature (very rough): Teq ~ Tstar * sqrt(Rs/(2a)) * (1 - A)^(1/4)
export function calculateEquilibriumTemperature(Tstar: number, albedo: number, a_au: number): number {
  const Rs_AU = 0.00465; // Solar radius in AU
  const factor = Math.sqrt(Rs_AU / Math.max(1e-6, 2 * a_au));
  const teq = Tstar * factor * Math.pow(Math.max(0, 1 - albedo), 0.25);
  return Number.isFinite(teq) ? teq : 0;
}

// Very rough False Alarm Probability decreasing with power and steps
export function calculateFalseAlarmProbability(power: number, steps: number): number {
  const s = Math.max(1, steps || 1000);
  const p = Math.max(0, power);
  const fap = Math.exp(-p) * Math.min(1, 2000 / s);
  return Math.max(0, Math.min(1, fap));
}

// Simple rule-based validation producing quality flags
export function validateDetection(q: DetectionQuality): string[] {
  const flags: string[] = [];
  if (q.snr < 5) flags.push("low_snr");
  if (q.depth < 0.0005) flags.push("shallow_depth");
  if (q.period <= 0) flags.push("invalid_period");
  if (q.dataPoints < 100) flags.push("insufficient_points");
  if (q.duration <= 0) flags.push("invalid_duration");
  if (flags.length === 0) flags.push("passes_basic_checks");
  return flags;
}
