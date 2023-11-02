import './testlab-form-autocomplete.scss';

import DebouncedInput from '@common/debounced-input/DebouncedInput';
import TestlabFormAutocompleteList from '@common/form/autocomplete/TestlabFormAutocompleteList';
import { TestlabInputBaseProps } from '@common/form/TestlabFormInput';
import TestlabFormRequiredLabel from '@common/form/TestlabFormRequiredLabel';
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
  value?: string;
  description?: string;
  onClick?: (result: ResultDataType) => void;
  errorMessage?: string;
  maxListLength?: number;
  spacing?: boolean;
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
  value,
  description,
  required = false,
  onClick,
  errorMessage,
  size = 'small',
  maxListLength,
  spacing = false,
}: AutoCompleteProps<FormDataType, ResultDataType>) => {
  const { control, setValue } = useFormContext<FormDataType>();
  const [show, setShow] = useState(false);
  const resultsRef = useRef<HTMLUListElement>(null);
  const [inputValue, setInputValue] = useState(value);
  const selection = useWatch<FormDataType>({
    control,
    name: name,
  }) as ResultDataType;

  useEffect(() => {
    if (selection && !retainSelection) {
      setInputValue(undefined);
    }
  }, [selection]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      resultsRef.current &&
      !resultsRef.current.contains(event.target as Node)
    ) {
      setShow(false);
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
      setShow(false);
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
        value={inputValue}
        onChange={handleOnChange}
        errorMessage={errorMessage}
        onFocus={() => setShow(true)}
        size={size}
      />
      <ul className="testlab-form-autocomplete__list" ref={resultsRef}>
        <TestlabFormAutocompleteList
          resultList={resultList}
          resultLabelKey={resultLabelKey}
          resultDescriptionKey={resultDescriptionKey}
          onClick={handleOnClick}
          show={show}
          name={name}
          maxListLength={maxListLength}
        />
      </ul>
    </div>
  );
};

export default TestlabFormAutocomplete;
