import './testlab-form-autocomplete.scss';

import DebouncedInput from '@common/debounced-input/DebouncedInput';
import TestlabFormAutocompleteList from '@common/form/autocomplete/TestlabFormAutocompleteList';
import TestlabFormRequiredLabel from '@common/form/TestlabFormRequiredLabel';
import { Size } from '@common/types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Path, PathValue, useFormContext, useWatch } from 'react-hook-form';

export interface Props<FormData, ResultData> {
  resultList: ResultData[];
  label: string;
  onChange: (value: string) => void;
  resultLabelKey: keyof ResultData;
  name: Path<FormData>;
  resultDescriptionKey?: keyof ResultData;
  retainSelection?: boolean;
  value?: string;
  description?: string;
  required?: boolean;
  onClick?: (result: ResultData) => void;
  errorMessage?: string;
  size?: Size;
  maxListLength?: number;
}

const TestlabFormAutocomplete = <
  FormData extends object,
  ResultData extends PathValue<FormData, Path<FormData>>,
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
}: Props<FormData, ResultData>) => {
  const { control, setValue } = useFormContext<FormData>();
  const [show, setShow] = useState(false);
  const resultsRef = useRef<HTMLUListElement>(null);
  const [inputValue, setInputValue] = useState(value);
  const selection = useWatch<FormData>({
    control,
    name: name,
  }) as ResultData;

  useEffect(() => {
    if (selection) {
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
    (name: Path<FormData>, result: ResultData) => {
      setShow(false);
      setInputValue(retainSelection ? result[resultLabelKey] : undefined);
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
    <div className="testlab-form-autocomplete testlab-form__input">
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
