import { isNotDefined } from '@common/util/validationUtils';
import {
  ArrayPath,
  type FieldPath,
  type FieldValues,
  type FormState,
  get,
} from 'react-hook-form';
import { FieldError } from 'react-hook-form/dist/types/errors';

/**
 * Retrieves the error message for a specific form field.
 * @template TFieldValues - The form field type
 * @param {FormState<TFieldValues>} form - The state of the form.
 * @param {FieldPath<TFieldValues>} name - The name of the field.
 * @return {string | undefined} The error message, if present.
 */
export const getErrorMessage = <TFieldValues extends FieldValues>(
  form: FormState<TFieldValues>,
  name: FieldPath<TFieldValues> | ArrayPath<TFieldValues>
): string | undefined => {
  if (isNotDefined(form?.errors)) {
    return undefined;
  }
  const regex = /\.(\d)\./g;
  const error: FieldError | undefined = get(
    form.errors,
    String(name).replaceAll(regex, '.[$1].')
  );
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

export const fetchWrapper = async (
  input: string,
  init?: RequestInit
): Promise<Response> => {
  if (init) {
    return await fetch(`/csrf`, { method: 'GET' }).then((response) => {
      return response.json().then(async (data) => {
        init.credentials = 'include';
        init.headers = {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': data.token,
        };
        return await fetch(input, init);
      });
    });
  } else {
    return await fetch(input, init);
  }
};
