type ClassValue =
  | null
  | undefined
  | string
  | number
  | ClassValue[]
  | { [key: string]: boolean };

const LOG_PREFIX = '[ClassName]';

function deepFlatten(
  arr: ClassValue[],
  result: (string | number | { [key: string]: boolean })[] = [],
): (string | number | { [key: string]: boolean })[] {
  try {
    for (const item of arr) {
      if (Array.isArray(item)) {
        deepFlatten(item, result);
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
  } catch (error) {
    console.error(`${LOG_PREFIX} Error: Failed to flatten class values`, error);
    return result;
  }
}

function sanitizeClass(className: string): string {
  try {
    return className.trim();
  } catch (error) {
    console.error(`${LOG_PREFIX} Error: Failed to sanitize class name`, error);
    return '';
  }
}

export function cx(...classes: ClassValue[]): string {
  try {
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
  } catch (error) {
    console.error(`${LOG_PREFIX} Error: Failed to compose class names`, error);
    return '';
  }
}
