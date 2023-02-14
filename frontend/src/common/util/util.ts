import { Option } from '../types';

export const enumToOptions = <T extends object>(
  enumToDeconstruct: T
): Option[] =>
  Object.entries(enumToDeconstruct).map(([key, value]) => ({
    value: value,
    label: key,
  }));
