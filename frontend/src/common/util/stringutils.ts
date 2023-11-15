/**
 * Joins an array of strings into a single readable string.
 * @param {string[]} list - Array of strings to join.
 * @returns {string} Joined string.
 */
export const joinStringsToList = (list: string[]): string => {
  if (list.length === 1) return list[0];
  const firsts = list.slice(0, list.length - 1);
  const last = list[list.length - 1];
  return firsts.join(', ') + ' og ' + last;
};

/**
 * Capitalizes the first character of a string.
 * @param {string} str - String to capitalize.
 * @returns {string} Capitalized string.
 */
export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Sanitizes an emum value to be used in a label by replacing underscores with
 * spaces and capitalizing the first character.
 * @param {string} label - Label to sanitize.
 * @returns {string} Sanitized label.
 */
export const sanitizeEnumLabel = (label: string): string =>
  capitalize(label.replace('_', ' '));

/**
 * Extracts the domain from a given URL.
 * @param {string} [url] - URL to extract the domain from.
 * @returns {string} Extracted domain, or the original URL if extraction fails.
 */
export const extractDomain = (url?: string): string => {
  if (!url) return '';

  try {
    const urlObj = new URL(url);
    return urlObj.host;
  } catch (e) {
    return url;
  }
};

/**
 * Parses a value as a number, throwing an error if the value is not a valid number.
 * @param {number|string} value - Value to parse as a number.
 * @returns {number} Parsed number.
 * @throws {Error} Will throw an error if the value is not a valid number.
 */
export const parseNumberInput = (value: number | string): number => {
  const numberValue = Number(value);
  if (!isNaN(numberValue)) {
    return numberValue;
  } else {
    throw Error('Ugyldig type');
  }
};

/**
 * Formats a date string into 'dd.mm.yyyy' format.
 * @param {string} dateString - Date string to format.
 * @returns {string} Formatted date string.
 */
export const formatDateString = (dateString: string): string => {
  const date = new Date(dateString);
  const format = new Intl.DateTimeFormat('nb-NO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  try {
    return format.format(date);
  } catch (e) {
    return dateString;
  }
};

/**
 * Removes all spaces from a string.
 * @param {string} s - String from which spaces are to be removed.
 * @returns {string} String without spaces.
 */
export const removeSpaces = (s: string): string => s.replace(/\s/g, '');
