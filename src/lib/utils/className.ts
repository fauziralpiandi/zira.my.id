type ClassValue =
  | null
  | undefined
  | string
  | number
  | ClassValue[]
  | { [key: string]: boolean };

const deepFlatten = (
  arr: ClassValue[],
  result: (string | number | { [key: string]: boolean })[] = []
): (string | number | { [key: string]: boolean })[] => {
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
};

const sanitizeClass = (className: string): string => className.trim();

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
