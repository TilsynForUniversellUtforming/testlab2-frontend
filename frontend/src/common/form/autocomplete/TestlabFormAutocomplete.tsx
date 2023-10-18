import './testlab-form-autocomplete.scss';

import DebouncedInput from '@common/debounced-input/DebouncedInput';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Path, PathValue, useFormContext } from 'react-hook-form';

export interface Props<FormData, ResultData> {
  label: string;
  value?: string;
  description?: string;
  required?: boolean;
  hidden?: boolean;
  disabled?: boolean;
  resultList: ResultData[];
  onChange: (value: string) => void;
  resultLabelKey: keyof ResultData;
  name: Path<FormData>;
  errorMessage?: string;
}

const TestlabFormAutocomplete = <
  FormData extends object,
  ResultData extends PathValue<FormData, Path<FormData>>,
>({
  label,
  value,
  description,
  required = false,
  resultList,
  onChange,
  name,
  resultLabelKey,
  errorMessage,
}: Props<FormData, ResultData>) => {
  const { setValue } = useFormContext<FormData>();
  const [show, setShow] = useState(false);
  const resultsRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [inputValue, setInputValue] = useState(value);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      resultsRef.current &&
      !resultsRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
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

  const handleOnClick = (name: Path<FormData>, result: ResultData) => {
    setShow(false);
    setInputValue(result[resultLabelKey]);
    setValue(name, result);
  };

  const handleOnChange = useCallback(
    (nextInputValue: string) => {
      if (inputValue !== nextInputValue) {
        onChange(nextInputValue);
      }
    },
    [inputValue]
  );

  return (
    <div className="testlab-form-autocomplete">
      <label
        htmlFor="testlab-form-autocorrect"
        className="testlab-form__input-label"
      >
        {label}
        {required && <span className="asterisk-color">*</span>}
        {description && (
          <div className="testlab-form__input-sub-label">{description}</div>
        )}
      </label>
      <DebouncedInput
        id="testlab-form-autocorrect"
        value={inputValue}
        onChange={handleOnChange}
        errorMessage={errorMessage}
        onFocus={() => setShow(true)}
      />
      <ul className="testlab-form-autocomplete__list" ref={resultsRef}>
        {show &&
          resultList.map((result, idx) => {
            const resultLabel =
              typeof result[resultLabelKey] === 'string'
                ? result[resultLabelKey]
                : null;

            return (
              <li
                className="testlab-form-autocomplete__list-item"
                key={`${resultLabel}_${idx}`}
              >
                <div className="button-wrapper">
                  <button
                    type="button"
                    onClick={() => handleOnClick(name, result)}
                    className="testlab-form-autocomplete__list__button"
                    ref={buttonRef}
                  >
                    {resultLabel}
                  </button>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default TestlabFormAutocomplete;
