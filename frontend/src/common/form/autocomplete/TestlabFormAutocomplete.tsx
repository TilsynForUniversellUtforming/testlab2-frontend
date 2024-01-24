import './testlab-form-autocomplete.scss';

import TestlabFormAutocompleteList from '@common/form/autocomplete/TestlabFormAutocompleteList';
import { TestlabInputBaseProps } from '@common/form/TestlabFormInput';
import { TestlabFormLabel } from '@common/form/TestlabFormRequiredLabel';
import { getErrorMessage } from '@common/form/util';
import { isDefined } from '@common/util/validationUtils';
import { Search } from '@digdir/design-system-react';
import classnames from 'classnames';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Path, PathValue, useFormContext, useWatch } from 'react-hook-form';

import { getLabelString } from './util';

export interface AutoCompleteProps<
  FormDataType extends object,
  ResultDataType extends PathValue<FormDataType, Path<FormDataType>>,
> extends Omit<TestlabInputBaseProps<FormDataType>, 'onChange'> {
  resultList: ResultDataType[];
  onChange: (value: string) => void;
  resultLabelKey: Path<ResultDataType>;
  resultDescriptionKey?: Path<ResultDataType>;
  retainValueOnClick?: boolean;
  retainLabelValueChange?: boolean;
  description?: string;
  onClick?: (result: ResultDataType) => void;
  maxListLength?: number;
  spacing?: boolean;
  hideErrors?: boolean;
  customError?: string;
}

/**
 * Component that provides a debounced autocomplete input field within a form.
 * It displays a list of suggestions based on the user's input, allowing users to select an option from the list.
 * The component is integrated with `react-hook-form` for form state management.
 *
 * @template FormDataType The type of the form data object.
 * @template ResultDataType The type of the individual result data items, presented in the autocomplete-list.
 *
 * @param {AutoCompleteProps<FormDataType, ResultDataType>} props - The props for the component.
 * @param {ResultDataType[]} props.resultList - An array of data objects to display in the autocomplete list.
 * @param {string} props.label - Label for the autocomplete input field.
 * @param {string} [props.description] - Optional description for the input field.
 * @param {boolean} [props.required=false] - Indicates if the input field is required.
 * @param {boolean} [props.hideLabel] - If true, hides the label of the input field.
 * @param {(value: string) => void} props.onChange - Function called when the input value changes.
 * @param {keyof ResultDataType} props.resultLabelKey - The key in the result data object used for deriving the label.
 * @param {keyof ResultDataType} [props.resultDescriptionKey] - Optional key in the result data object used for deriving additional description.
 * @param {string} props.name - The name attribute for the input field, used for form control.
 * @param {(result: ResultDataType) => void} [props.onClick] - Function called when an item in the list is clicked.
 * @param {boolean} [props.retainValueOnClick=true] - If true, retains the label value in the autocomplete input field when an item is clicked.
 * @param {boolean} [props.retainLabelValueChange=false] - If true, retains the user's input value in the autocomplete input field a form value is set.
 * @param {string} [props.size='small'] - Size of the input field.
 * @param {number} [props.maxListLength] - Maximum number of items to display in the list.
 * @param {boolean} [props.spacing=false] - If true, adds additional spacing to bottom of the component.
 * @param {string} [props.customError] - Custom error message to display.
 * @param {boolean} [props.hideErrors=false] - If set to true, error messages are not displayed.
 *
 * @returns {ReactNode}
 */
const TestlabFormAutocomplete = <
  FormDataType extends object,
  ResultDataType extends PathValue<FormDataType, Path<FormDataType>>,
>({
  resultList,
  label,
  onChange,
  resultLabelKey,
  resultDescriptionKey,
  name,
  retainValueOnClick = true,
  retainLabelValueChange = false,
  description,
  required = false,
  onClick,
  size = 'small',
  maxListLength,
  spacing = false,
  hideLabel = false,
  hideErrors = false,
  customError,
}: AutoCompleteProps<FormDataType, ResultDataType>): ReactNode => {
  const { control, setValue, formState } = useFormContext<FormDataType>();
  const [showResultList, setShowResultList] = useState(false);
  const resultsRef = useRef<HTMLUListElement>(null);
  const [inputValueLabel, setInputValueLabel] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const resultData = useWatch<FormDataType>({
    control,
    name: name,
  }) as ResultDataType;

  useEffect(() => {
    if (retainLabelValueChange) {
      return;
    } else {
      setInputValue('');
      setInputValueLabel('');
    }
  }, [resultData]);

  useEffect(() => {
    if (hideErrors) {
      return;
    }
    if (customError) {
      setErrorMessage(customError);
    } else {
      setErrorMessage(getErrorMessage(formState, name));
    }
  }, [customError, formState.errors]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      resultsRef.current &&
      !resultsRef.current.contains(event.target as Node)
    ) {
      setShowResultList(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isDefined(inputValue)) {
        onChange(inputValue);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [inputValue]);

  const handleOnClick = useCallback(
    (name: Path<FormDataType>, result: ResultDataType) => {
      setShowResultList(false);
      setInputValueLabel(
        retainValueOnClick ? getLabelString(result, resultLabelKey) : ''
      );
      if (onClick) {
        onClick(result);
      } else {
        setValue(name, result);
      }
    },
    []
  );

  const handleOnChange = useCallback((input: string) => {
    setInputValue(input);
    setInputValueLabel(input);
  }, []);

  return (
    <div
      className={classnames('testlab-form-autocomplete', {
        spacing: spacing,
      })}
    >
      <Search
        id="autocomplete"
        label={
          <TestlabFormLabel
            htmlFor="autocomplete"
            label={label}
            required={required}
            description={description}
          />
        }
        type="text"
        value={inputValueLabel}
        onChange={(e) => handleOnChange(e.target.value)}
        onFocus={() => setShowResultList(true)}
        error={errorMessage}
        size={size}
        hideLabel={hideLabel}
      />
      <ul className="testlab-form-autocomplete__list" ref={resultsRef}>
        <TestlabFormAutocompleteList
          resultList={resultList}
          resultLabelKey={resultLabelKey}
          resultDescriptionKey={resultDescriptionKey}
          onClick={handleOnClick}
          show={showResultList}
          name={name}
          maxListLength={maxListLength}
        />
      </ul>
    </div>
  );
};

export default TestlabFormAutocomplete;
