import { get, Path } from 'react-hook-form';

export const getLabelString = <FormDataType extends object>(
  value: FormDataType,
  valueKey?: Path<FormDataType> | string
): string => get(value, valueKey) || '';
