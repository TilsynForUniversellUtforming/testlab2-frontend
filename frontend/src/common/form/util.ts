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

  const rootError: FieldError | undefined = get(
    form.errors,
    `${String(name).replaceAll(regex, '.[$1].')}.root`
  );
  return error?.message || rootError?.message;
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

const getTokenFromResponse = async (response: Response): Promise<string> => {
  const responseText = await response.text();
  try {
    const token = JSON.parse(responseText)['token'];
    if (typeof token === 'string') {
      return token;
    } else {
      return '';
    }
  } catch (e) {
    return '';
  }
};

const getTokenFromCookie = (): string | undefined => {
  const cookies = document.cookie.split(';');

  function getCsrfcookies() {
    return cookies.filter((cookie) => {
      return cookie.includes('XSRF-TOKEN');
    });
  }

  if (cookies.length === 0 && cookies.includes('XSRF-TOKEN')) {
    return cookies[0].split('=')[1];
  } else {
    const csrfcookies = getCsrfcookies();
    console.log('Csrfcookies ' + csrfcookies);
    if (csrfcookies.length > 0) {
      return csrfcookies[0].split('=')[1];
    }
  }
};

export const fetchWithCsrf = async (
  input: string,
  init?: RequestInit,
  defaultContentType: boolean = true
): Promise<Response> => {
  if (init) {
    return await fetch(`/csrf`, { method: 'GET' }).then(async (response) => {
      const token = await getTokenFromResponse(response);

      if (defaultContentType) {
        init.headers = {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': token,
        };
      } else {
        init.headers = {
          'X-XSRF-TOKEN': token,
        };
      }
      return await fetch(input, init);
    });
  } else {
    return await fetch(input, init);
  }
};

export const fetchWithErrorHandling: typeof fetch = async (
  input: Request | string | URL,
  ...rest
) => {
  async function call(): Promise<Response> {
    return fetch(input, ...rest).catch((error) => {
      throw error;
    });
  }
  return await call();
};
