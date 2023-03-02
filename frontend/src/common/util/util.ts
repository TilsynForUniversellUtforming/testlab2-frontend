import { Option } from '../types';

export const enumToOptions = <T extends object>(
  enumToDeconstruct: T
): Option[] =>
  Object.entries(enumToDeconstruct).map(([key, value]) => ({
    value: value,
    label: key,
  }));

export const isDefined = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0 && value.every((e) => isDefined(e));
  }

  if (typeof value === 'object') {
    return Object.keys(value).length > 0;
  }

  return typeof value !== 'undefined' && value != null;
};
