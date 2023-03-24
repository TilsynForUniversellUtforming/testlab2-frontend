import { FieldValues, Path } from 'react-hook-form';
import {
  UseFormClearErrors,
  UseFormSetError,
} from 'react-hook-form/dist/types/form';

export const testreglarMessage = 'Testreglar må veljast';

export interface Props<T extends object, V extends FieldValues> {
  selection: T[];
  name: Path<V>;
  setError: UseFormSetError<V>;
  clearErrors: UseFormClearErrors<V>;
  message: string;
}

/**
 * Custom React hook for validating fields using react-hook-form.
 * @template T - The type of the selection array.
 * @template V - The type of the field values.
 * @param {T[]} selection - The selection array of type T to validate.
 * @param {Path<V>} name - The name of the field to validate.
 * @param {UseFormSetError<V>} setError - The setError function from react-hook-form to set an error message for the field.
 * @param {UseFormClearErrors<V>} clearErrors - The clearErrors function from react-hook-form to clear an error message for the field.
 * @param {string} message - The error message to display if the selection array is empty.
 * @returns {boolean} - Returns true if the selection array is not empty and false otherwise.
 */

const useValidate = <T extends object, V extends FieldValues>({
  selection,
  name,
  setError,
  clearErrors,
  message,
}: Props<T, V>): boolean => {
  if (selection.length === 0) {
    setError(name, {
      type: 'manual',
      message: message,
    });
    return false;
  } else {
    clearErrors(name);
    return true;
  }
};

export default useValidate;
