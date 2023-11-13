import {
  ArrayPath,
  type FieldPath,
  type FieldValues,
  type FormState,
  get,
} from 'react-hook-form';
import { FieldError } from 'react-hook-form/dist/types/errors';

export const getErrorMessage = <TFieldValues extends FieldValues>(
  form: FormState<TFieldValues>,
  name: FieldPath<TFieldValues> | ArrayPath<TFieldValues>
): string | undefined => {
  const error: FieldError | undefined = get(form.errors, name);
  return error?.message;
};

/**
 * Helper function to retain just the alphanumerical values from a string.
 * @param {string} str - The input parameter without formatting.
 * @return {string} The formatted parameter.
 */

export const normalizeString = (str: string): string => {
  return str
    .trim()
    .toLowerCase()
    .replace(/[^a-zæøå0-9]/gi, '');
};
