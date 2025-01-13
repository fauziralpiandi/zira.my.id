export const pluralize = (value: number, unit: string) =>
  `${value} ${unit}${value === 1 ? '' : 's'}`;
