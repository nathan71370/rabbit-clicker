/**
 * Internal helper for number formatting with K, M, B, T notation
 * @param value - Number to format
 * @param decimals - Number of decimal places
 * @param showDecimalsUnder1000 - Whether to show decimals for values < 1000
 * @returns Formatted string
 */
function formatNumberInternal(
  value: number,
  decimals: number,
  showDecimalsUnder1000: boolean
): string {
  if (!Number.isFinite(value)) {
    return '0';
  }

  const absValue = Math.abs(value);

  if (absValue < 1000) {
    return showDecimalsUnder1000
      ? value.toFixed(decimals)
      : Math.floor(value).toString();
  }

  const units = ['K', 'M', 'B', 'T', 'Qa', 'Qi'];
  const tier = Math.floor(Math.log10(absValue) / 3);
  const unitIndex = tier - 1;

  if (unitIndex >= units.length) {
    return value.toExponential(decimals);
  }

  const unit = units[unitIndex];
  const scaled = value / Math.pow(1000, tier);
  return scaled.toFixed(decimals) + unit;
}

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
  return formatNumberInternal(value, decimals, false);
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
  return formatNumberInternal(value, decimals, true);
}
