// Class value can be a string, number, object of booleans, or nested arrays
type ClassValue =
  | null
  | undefined
  | string
  | number
  | ClassValue[]
  | { [key: string]: boolean };

// Recursively flattens nested class values into a flat array.
// Only keeps strings, numbers, or valid object maps.
const deepFlatten = (
  arr: ClassValue[],
  result: (string | number | { [key: string]: boolean })[] = []
): (string | number | { [key: string]: boolean })[] => {
  for (const item of arr) {
    if (Array.isArray(item)) {
      deepFlatten(item, result); // Dive deeper
    } else if (item !== null && item !== undefined) {
      if (
        typeof item === 'string' ||
        typeof item === 'number' ||
        (typeof item === 'object' && item !== null)
      ) {
        result.push(item);
      }
    }
  }
  return result;
};

// Trim class names, just to be safe
const sanitizeClass = (className: string): string => className.trim();

/**
 * Dynamically compose class names with deep flexibility.
 *
 * Accepts a mix of:
 * - strings: `'btn'`
 * - numbers: `0`
 * - objects: `{ active: true, disabled: false }`
 * - nested arrays: `['foo', ['bar', { baz: true }]]`
 *
 * Filters out falsy, trims extra whitespace, and joins everything cleanly.
 */
export const cx = (...classes: ClassValue[]): string => {
  return deepFlatten(classes)
    .map((value) => {
      if (typeof value === 'string' || typeof value === 'number') {
        const str = value.toString();
        return str ? sanitizeClass(str) : null;
      }
      if (typeof value === 'object' && value !== null) {
        return Object.entries(value)
          .filter(([, isActive]) => isActive)
          .map(([key]) => (key ? sanitizeClass(key) : null))
          .filter(Boolean)
          .join(' ');
      }
      return null;
    })
    .filter(Boolean)
    .join(' ')
    .trim();
};
