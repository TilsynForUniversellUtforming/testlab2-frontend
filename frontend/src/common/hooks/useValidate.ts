export interface ValidationProps {
  isArray?: boolean;
  value: any;
}

const useValidate = (validationList: ValidationProps[]): boolean => {
  let result = false;

  for (const validation of validationList) {
    const { isArray, value } = validation;
    if (isArray) {
      if (Array.isArray(value) && value.length > 0) {
        result = true;
      } else {
        break;
      }
    } else {
      if (
        (typeof value === 'string' && value.length > 0) ||
        typeof value === 'number'
      ) {
        result = true;
      } else {
        break;
      }
    }
  }

  return result;
};

export default useValidate;
