export type ValidationType = 'name' | 'array';

export interface ValidationProps {
  validationType: ValidationType;
  value: any;
}

const useValidate = (validationList: ValidationProps[]): boolean => {
  let result = false;

  for (const validation of validationList) {
    const { validationType, value } = validation;
    if (validationType === 'name') {
      if (typeof value === 'string' && value.length > 0) {
        result = true;
      } else {
        break;
      }
    }

    if (validationType === 'array') {
      if (Array.isArray(value) && value.length > 0) {
        result = true;
      } else {
        break;
      }
    }
  }

  return result;
};

export default useValidate;
