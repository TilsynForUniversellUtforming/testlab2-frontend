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
