import './testlab-form-autocomplete.scss';

import DebouncedInput from '@common/debounced-input/DebouncedInput';
import TestlabFormAutocompleteList from '@common/form/autocomplete/TestlabFormAutocompleteList';
import { TestlabInputBaseProps } from '@common/form/TestlabFormInput';
import TestlabFormRequiredLabel from '@common/form/TestlabFormRequiredLabel';
import { getErrorMessage } from '@common/form/util';
import { isDefined } from '@common/util/validationUtils';
import classnames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Path, PathValue, useFormContext, useWatch } from 'react-hook-form';

export interface AutoCompleteProps<
  FormDataType extends object,
  ResultDataType extends PathValue<FormDataType, Path<FormDataType>>,
> extends Omit<TestlabInputBaseProps<FormDataType>, 'onChange'> {
  resultList: ResultDataType[];
  onChange: (value: string) => void;
  resultLabelKey: keyof ResultDataType;
  resultDescriptionKey?: keyof ResultDataType;
  retainSelection?: boolean;
  description?: string;
  onClick?: (result: ResultDataType) => void;
  maxListLength?: number;
  spacing?: boolean;
  hideError?: boolean;
}

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
  retainSelection = true,
  description,
  required = false,
  onClick,
  size = 'small',
  maxListLength,
  spacing = false,
  hideLabel,
  hideError = false,
}: AutoCompleteProps<FormDataType, ResultDataType>) => {
  const { control, setValue, formState } = useFormContext<FormDataType>();
  const [showResultList, setShowResultList] = useState(false);
  const resultsRef = useRef<HTMLUListElement>(null);
  const [inputValue, setInputValue] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const selection = useWatch<FormDataType>({
    control,
    name: name,
  }) as ResultDataType;

  useEffect(() => {
    if (selection && !retainSelection) {
      setInputValue(undefined);
    }
  }, [selection]);

  useEffect(() => {
    if (hideError) {
      return;
    }

    if (resultList.length === 0 && isDefined(inputValue)) {
      setErrorMessage(`Ingen treff på ${inputValue}`);
    } else {
      setErrorMessage(getErrorMessage(formState, name));
    }
  }, [resultList.length, formState.errors, inputValue, hideError]);

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

  const handleOnClick = useCallback(
    (name: Path<FormDataType>, result: ResultDataType) => {
      setShowResultList(false);
      setInputValue(result[resultLabelKey]);
      if (onClick) {
        onClick(result);
      } else {
        setValue(name, result);
      }
    },
    []
  );

  const handleOnChange = useCallback(
    (nextInputValue: string) => {
      if (inputValue !== nextInputValue) {
        onChange(nextInputValue);
        setInputValue(nextInputValue);
      }
    },
    [inputValue]
  );

  return (
    <div
      className={classnames('testlab-form-autocomplete', {
        spacing: spacing,
      })}
    >
      <DebouncedInput
        id="testlab-form-autocorrect"
        label={<TestlabFormRequiredLabel label={label} required={required} />}
        description={description}
        onChange={handleOnChange}
        errorMessage={errorMessage}
        onFocus={() => setShowResultList(true)}
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
