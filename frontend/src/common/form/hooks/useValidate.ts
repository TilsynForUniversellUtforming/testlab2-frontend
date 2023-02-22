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
