import { Option } from '../types';

export const enumToOptions = <T extends object>(
  enumToDeconstruct: T
): Option[] =>
  Object.entries(enumToDeconstruct).map(([key, value]) => ({
    value: value,
    label: key,
  }));

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

export const isNotDefined = <T>(value: T | undefined | null): value is T =>
  !isDefined(value);

export const isUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export function isOrgnummer(s: string): boolean {
  const noWhitespace = s.replace(/\s/g, '');
  if (noWhitespace.length !== 9) {
    return false;
  }

  const siffer = noWhitespace.split('').map((c) => parseInt(c));
  if (siffer.some((n) => isNaN(n))) {
    return false;
  }

  const vekter = [3, 2, 7, 6, 5, 4, 3, 2];
  const sum = siffer
    .slice(0, 8)
    .reduce((acc, curr, i) => acc + curr * vekter[i], 0);
  const rest = sum % 11;
  const kontrollsiffer = rest === 0 ? 0 : 11 - rest;
  return kontrollsiffer === siffer[8];
}
