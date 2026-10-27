// Number formatting shared by the widgets.

/** A big count with thousands separators, or in scientific form "1.23 × 10¹⁵" once it passes a billion. */
export function formatCount(n: bigint): string {
  const s = n.toString();
  if (s.length <= 10) return s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const mantissa = `${s[0]}.${s.slice(1, 3)}`;
  const sup = [...String(s.length - 1)].map((d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)]).join('');
  return `${mantissa} × 10${sup}`;
}

const SECONDS_PER_YEAR = 365.25 * 24 * 3600;
/** About 13.8 billion years. */
export const AGE_OF_UNIVERSE_YEARS = 13.8e9;

/** How long `checks` subset tests take at `rate` per second, in rough human terms. */
export function formatDuration(checks: bigint, rate = 1e9): string {
  const seconds = Number(checks) / rate;
  if (seconds < 1e-3) return 'under a millisecond';
  if (seconds < 1) return `${Math.round(seconds * 1000)} milliseconds`;
  if (seconds < 120) return `${Math.round(seconds)} seconds`;
  if (seconds < 7200) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 2 * 86400) return `${Math.round(seconds / 3600)} hours`;
  const years = seconds / SECONDS_PER_YEAR;
  if (years < 2) return `${Math.round(seconds / 86400)} days`;
  if (years < 1e6) return `${Math.round(years).toLocaleString('en-US')} years`;
  const ages = years / AGE_OF_UNIVERSE_YEARS;
  if (ages < 0.5) return `${formatCount(BigInt(Math.round(years)))} years`;
  if (ages < 1.5) return 'about the age of the universe';
  return `${formatCount(BigInt(Math.round(ages)))} × the age of the universe`;
}

/** "{0, 1, 3}" */
export const setText = (set: readonly number[]) => `{${set.join(', ')}}`;
