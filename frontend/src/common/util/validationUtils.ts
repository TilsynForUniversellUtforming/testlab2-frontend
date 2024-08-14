import { OptionType } from '@common/types';
import { removeSpaces } from '@common/util/stringutils';

/**
 * Checks if a value is defined (not null, undefined, or empty).
 * @template T - The type of the value to check.
 * @param {T | undefined | null} value - The value to check.
 * @returns {boolean} True if the value is defined, otherwise false.
 */
export const isDefined = <T>(value: T | undefined | null): value is T => {
  if (typeof value === 'string') {
    return value.length > 0;
  }

  if (typeof value === 'number') {
    return !isNaN(value);
  }

  if (Array.isArray(value)) {
    return value.length > 0 && value.every((e) => isDefined(e));
  }

  if (typeof value === 'object') {
    return value !== null && Object.keys(value).length > 0;
  }

  return value != null;
};

/**
 * Checks if a value is not defined (null, undefined, or empty). Inverse of isDefined
 * @template T - The type of the value to check.
 * @param {T | undefined | null} value - The value to check.
 * @returns {boolean} True if the value is not defined, otherwise false.
 */
export const isNotDefined = <T>(
  value: T | undefined | null
): value is undefined | null => !isDefined(value);

/**
 * Checks if an object is valid (not null, undefined, and has at least one key).
 * @template T - The type of the object to check.
 * @param {T | undefined | null} objectToCheck - The object to validate.
 * @param {boolean} strict - If all object keys should have values
 * @returns {boolean} True if the object is valid, otherwise false.
 */
export const isValidObject = <T extends Record<string, unknown> | null>(
  objectToCheck?: T,
  strict: boolean = true
): boolean => {
  if (typeof objectToCheck !== 'object' || objectToCheck === null) {
    return false;
  }

  const keys = Object.keys(objectToCheck);
  if (keys.length === 0) {
    return false;
  }

  if (strict) {
    return keys.every((key) => {
      const value = objectToCheck[key];
      return value !== null && value !== undefined && value !== '';
    });
  } else {
    return keys.some((key) => {
      const value = objectToCheck[key];
      return value !== null && value !== undefined && value !== '';
    });
  }
};

/**
 * Checks if a string is a valid URL.
 * @param {string} url - The string to validate as a URL.
 * @returns {boolean} True if the string is a valid URL, otherwise false.
 */
export const isUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Validates an organisasjonsnummer.
 * @param {string} s - The organisasjonsnummer to validate.
 * @returns {boolean} True if the number is a valid organization number, otherwise false.
 */
export const isOrgnummer = (s: string): boolean => {
  const utenMellomrom = removeSpaces(s);
  if (utenMellomrom.length !== 9) {
    return false;
  }

  const sifferListe = utenMellomrom.split('').map((c) => parseInt(c));
  if (sifferListe.some((n) => isNaN(n))) {
    return false;
  }

  const vekter = [3, 2, 7, 6, 5, 4, 3, 2];
  const sum = sifferListe
    .slice(0, 8)
    .reduce((acc, curr, i) => acc + curr * vekter[i], 0);
  const rest = sum % 11;
  const kontrollsiffer = rest === 0 ? 0 : 11 - rest;
  return kontrollsiffer === sifferListe[8];
};

/**
 * Filter function to make list of options typesafe when mapping to OptionType
 * @Param {OptionType | undefined} option - The mapped option
 * @return {OptionType} - Defined option
 */
export const isOption = (
  option: OptionType | undefined
): option is OptionType => {
  return !!option;
};
