const LOG_PREFIX = '[Pluralize]';

export function pluralize(
  value: number,
  singular: string,
  plural: string = `${singular}s`,
): string {
  try {
    if (isNaN(value)) {
      console.error(`${LOG_PREFIX} Error: Invalid number value: ${value}`);
      return '0 ' + plural;
    }

    if (!singular) {
      console.error(`${LOG_PREFIX} Error: Missing singular form`);
      return `${value}`;
    }

    return `${value} ${value === 1 ? singular : plural}`;
  } catch (error) {
    console.error(`${LOG_PREFIX} Error: Failed to pluralize`, error);
    return `${value} ${plural}`;
  }
}
