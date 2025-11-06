/**
 * Format a number with K, M, B, T notation for readability
 * @param value - Number to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted string (e.g., "1.2K", "3.5M")
 *
 * Examples:
 * - 123 → "123"
 * - 1234 → "1.2K"
 * - 1234567 → "1.2M"
 * - 1234567890 → "1.2B"
 * - 1234567890000 → "1.2T"
 */
export function formatNumber(value: number, decimals: number = 1): string {
  if (!Number.isFinite(value)) {
    return '0';
  }

  const absValue = Math.abs(value);

  if (absValue < 1000) {
    // Less than 1K: show whole number
    return Math.floor(value).toString();
  }

  const units = ['K', 'M', 'B', 'T', 'Qa', 'Qi'];
  const tier = Math.floor(Math.log10(absValue) / 3);
  const unitIndex = tier - 1;

  if (unitIndex >= units.length) {
    // Beyond our units, use scientific notation
    return value.toExponential(decimals);
  }

  const unit = units[unitIndex];
  const scaled = value / Math.pow(1000, tier);

  return scaled.toFixed(decimals) + unit;
}

/**
 * Format a number with precise decimal representation
 * Shows more decimal places for better precision in displays
 * @param value - Number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string with higher precision
 *
 * Examples:
 * - 123.456 → "123.46"
 * - 1234.567 → "1.23K"
 * - 1234567.89 → "1.23M"
 */
export function formatNumberPrecise(value: number, decimals: number = 2): string {
  if (!Number.isFinite(value)) {
    return '0';
  }

  const absValue = Math.abs(value);

  if (absValue < 1000) {
    // Less than 1K: show with decimal places
    return value.toFixed(decimals);
  }

  const units = ['K', 'M', 'B', 'T', 'Qa', 'Qi'];
  const tier = Math.floor(Math.log10(absValue) / 3);
  const unitIndex = tier - 1;

  if (unitIndex >= units.length) {
    // Beyond our units, use scientific notation
    return value.toExponential(decimals);
  }

  const unit = units[unitIndex];
  const scaled = value / Math.pow(1000, tier);

  return scaled.toFixed(decimals) + unit;
}
