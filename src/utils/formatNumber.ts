/**
 * Format a number with K, M, B, T notation for readability
 * @param value - Number to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted string (e.g., "1.2K", "3.5M")
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
