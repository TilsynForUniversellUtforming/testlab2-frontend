import { Option } from '../types';

export const enumToOptions = <T extends object>(
  enumToDeconstruct: T
): Option[] =>
  Object.entries(enumToDeconstruct).map(([key, value]) => ({
    value: value,
    label: key,
  }));

export const responseToJson = (response: Response, errorMessage: string) => {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error(errorMessage);
  }
};
