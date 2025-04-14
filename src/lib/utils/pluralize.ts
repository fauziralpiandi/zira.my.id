export const pluralize = (
  value: number,
  singular: string,
  plural: string = `${singular}s`
): string => {
  return `${value} ${value === 1 ? singular : plural}`;
};
