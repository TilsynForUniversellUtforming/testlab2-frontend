import { OptionType } from '@common/types';
import DOMPurify from 'dompurify';

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
 * Replaces common ascii safe letters for æ, ø, å with the corresponding letter
 * @param {string} s - Ascii safe string
 * @returns {string} - String with norwegian letters
 * */
function asciiSafeCharactersToNorwegian(s: string): string {
  return s.replaceAll('aa', 'å').replaceAll('oe', 'ø').replaceAll('ae', 'æ');
}

/**
 * Sanitizes an emum value to be used in a label by replacing underscores with
 * spaces and capitalizing the first character.
 * @param {string} label - Label to sanitize.
 * @returns {string} Sanitized label.
 */
export const sanitizeEnumLabel = (label: string): string => {
  function isCamelCase(s: string): boolean {
    const camelCaseRegex = /^[a-z]+(?:[A-Z][a-z0-9]*)*$/;
    return camelCaseRegex.test(s);
  }

  let enumLabel = '';
  if (isCamelCase(label)) {
    enumLabel = label
      .trim()
      .split('')
      .reduce((acc, c) => (c === c.toUpperCase() ? acc + ' ' + c : acc + c), '')
      .split(/\s+/)
      .map((word, i) => (i === 0 ? capitalize(word) : word.toLowerCase()))
      .join(' ');
  } else {
    enumLabel = capitalize(
      label.toLocaleLowerCase('no-NO').replaceAll('_', ' ').replaceAll('-', ' ')
    );
  }

  return asciiSafeCharactersToNorwegian(enumLabel);
};

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
    throw Error(`Ugyldig type: ${value}`);
  }
};

/**
 * Formats a date string into 'dd.MM.yyyy HH:mm' format, with time part optional.
 * @param {string} dateString - Date string to format.
 * @param {boolean} includeTime - Include the time part of the date
 * @returns {string} Formatted date string.
 */
export const formatDateString = (
  dateString: string,
  includeTime: boolean = false
): string => {
  const date = new Date(dateString);
  try {
    return includeTime ? formatDateTime(date) : formatDate(date);
  } catch (e) {
    return dateString;
  }
};

/**
 * Checks if a given string represents a valid date.
 *
 * @param {string} dateString - The date string to validate.
 * @returns {boolean} Returns true if the dateString is a valid date, false otherwise.
 */
export const isValidStringDate = (dateString: string | undefined): boolean => {
  if (!dateString) {
    return false;
  }
  return !isNaN(Date.parse(dateString));
};

export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };

  const format = new Intl.DateTimeFormat('nb-NO', options);

  return format.format(date);
}

export function formatDateTime(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hourCycle: 'h24',
    hour: '2-digit',
    minute: '2-digit',
  };

  const format = new Intl.DateTimeFormat('nb-NO', options);

  return format.format(date);
}

/**
 * Removes all spaces from a string.
 * @param {string} s - String from which spaces are to be removed.
 * @returns {string} String without spaces.
 */
export const removeSpaces = (s: string): string => s.replace(/\s/g, '');

/**
 * Parses an HTML string and returns the text content, removing any HTML entities.
 * @param htmlString
 */
export const parseHtmlEntities = (htmlString: string): string => {
  const parser = new DOMParser();
  return (
    parser.parseFromString(htmlString, 'text/html').body.textContent ||
    htmlString
  ).replace(/([,.!?:])(?=\S)(?!$)/g, '$1 '); // Add spacing after punctiation if missing
};

/**
 * Creates a list of OptionType from a string literal type
 * * @param literals - An array of string literals from which to create the OptionType objects.
 *  @returns An array of OptionType objects with `value` and `label` properties.
 * */

export const createOptionsFromLiteral = <T extends string>(
  literals: T[]
): OptionType[] => {
  return literals.map((literal) => ({
    value: literal,
    label: sanitizeEnumLabel(literal),
  }));
};

/**
 * Converts a string of HTML to a ReactNode.
 */
export function htmlToReactNode(s: string) {
  const safeHTML = DOMPurify.sanitize(s);
  return <div dangerouslySetInnerHTML={{ __html: safeHTML }} />;
}

export function editDistance(a: string, b: string): number {
  // implementation of Wagner-Fischer algorithm: https://en.wikipedia.org/wiki/Wagner%E2%80%93Fischer_algorithm
  const rows = b.length + 1;
  const cols = a.length + 1;
  if (cols === 0) {
    return rows;
  }
  if (rows === 0) {
    return cols;
  }
  const distances: number[][] = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(0));
  for (let row = 0; row < rows; row++) {
    distances[row][0] = row;
  }
  for (let col = 0; col < cols; col++) {
    distances[0][col] = col;
  }
  for (let row = 1; row < rows; row++) {
    for (let col = 1; col < cols; col++) {
      const substitutionCost = b[row - 1] === a[col - 1] ? 0 : 1;
      distances[row][col] = Math.min(
        distances[row - 1][col] + 1,
        distances[row][col - 1] + 1,
        distances[row - 1][col - 1] + substitutionCost
      );
    }
  }
  return distances[rows - 1][cols - 1];
}

export function hasCapitalLetter(s: string): boolean {
  function isCapital(letter: string): boolean {
    return letter === letter.toLocaleUpperCase('no-NO');
  }

  if (s === '') {
    return false;
  }

  return s.split('').some(isCapital);
}

/**
 * Returns all substrings of s with length n.
 */
export function substrings(n: number, s: string): string[] {
  if (s === '') {
    return [];
  }

  const result = [];
  let remaining = s;
  while (n < remaining.length) {
    result.push(remaining.substring(0, n));
    remaining = remaining.slice(1);
  }
  result.push(remaining);
  return result;
}

/**
 * Removes time from string ISO-dates if dateString is date is valid
 * @param dateString - A date string (or date object).
 * @returns A string value of the date without time in YYYY-MM-DD format.
 */
export const removeTimeFromDateString = (
  dateString: string | Date | undefined
): string | undefined => {
  if (!dateString) {
    return undefined;
  }

  try {
    const dateObj = new Date(dateString);

    return dateObj.toISOString().split('T')[0];
  } catch (e) {
    return undefined;
  }
};
