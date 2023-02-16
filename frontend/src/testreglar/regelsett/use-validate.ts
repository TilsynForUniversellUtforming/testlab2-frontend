import {
  UseFormClearErrors,
  UseFormSetError,
} from 'react-hook-form/dist/types/form';

import { Testregel, TestRegelsett } from '../api/types';

const useValidate = (
  selection: Testregel[],
  setError: UseFormSetError<TestRegelsett>,
  clearErrors: UseFormClearErrors<TestRegelsett>
): boolean => {
  if (selection.length === 0) {
    setError('testregelList', {
      type: 'manual',
      message: 'Testreglar må veljast',
    });
    return false;
  } else {
    clearErrors('testregelList');
    return true;
  }
};

export default useValidate;
