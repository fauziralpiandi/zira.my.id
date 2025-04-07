/**
 * Returns a grammatically correct pluralized string based on the value.
 *
 * Supports custom plural forms for irregular nouns.
 * Falls back to adding "s" if plural form not provided.
 *
 * @param value - The numeric value to evaluate
 * @param singular - Singular form of the noun (e.g., "day")
 * @param plural - Optional plural form (e.g., "days")
 *
 * @example
 * pluralize(1, "day") = "1 day"
 * pluralize(2, "day") = "2 days"
 */
export const pluralize = (
  value: number,
  singular: string,
  plural: string = `${singular}s`
): string => {
  if (!Number.isInteger(value) || value < 0) return 'Invalid value';
  return `${value} ${value === 1 ? singular : plural}`;
};
