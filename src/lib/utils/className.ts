type ClassValue =
  | null
  | undefined
  | string
  | number
  | ClassValue[]
  | { [key: string]: boolean };

const deepFlatten = (
  arr: ClassValue[]
): (string | number | { [key: string]: boolean })[] => {
  return arr.flatMap(
    (item): (string | number | { [key: string]: boolean })[] => {
      if (Array.isArray(item)) {
        return deepFlatten(item);
      }
      if (item === null || item === undefined) {
        return [];
      }
      if (
        typeof item === 'string' ||
        typeof item === 'number' ||
        typeof item === 'object'
      ) {
        return [item];
      }
      return [];
    }
  );
};

export const cx = (...classes: ClassValue[]): string => {
  return deepFlatten(classes)
    .map((value) => {
      if (typeof value === 'string' || typeof value === 'number') {
        return value.toString();
      }
      if (typeof value === 'object' && value !== null) {
        return Object.entries(value)
          .filter(([isActive]) => isActive)
          .map(([key]) => key)
          .join(' ');
      }
      return '';
    })
    .filter(Boolean)
    .join(' ');
};
