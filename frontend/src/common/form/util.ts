import type { FieldPath, FieldValues, FormState } from 'react-hook-form';
import { FieldErrors } from 'react-hook-form/dist/types/errors';

export const getErrorMessage = <
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
>(
  form: FormState<TFieldValues>,
  name: TFieldName
): string | undefined =>
  (form.errors as FieldErrors<TFieldValues>)[name]?.message as string;

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
