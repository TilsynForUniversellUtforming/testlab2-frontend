import {
  type FieldPath,
  type FieldValues,
  type FormState,
  get,
} from 'react-hook-form';
import { FieldError } from 'react-hook-form/dist/types/errors';

/**
 * Retrieves the error message for a specific form field.
 * @param {FormState<TFieldValues>} form - The state of the form.
 * @param {TFieldName} name - The name of the field.
 * @return {string | undefined} The error message, if present.
 */
export const getErrorMessage = <
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
>(
  form: FormState<TFieldValues>,
  name: TFieldName
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
