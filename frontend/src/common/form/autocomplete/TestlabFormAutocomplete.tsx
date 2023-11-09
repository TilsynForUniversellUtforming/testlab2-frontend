import './testlab-form-autocomplete.scss';

import TestlabFormAutocompleteList from '@common/form/autocomplete/TestlabFormAutocompleteList';
import { TestlabInputBaseProps } from '@common/form/TestlabFormInput';
import TestlabFormRequiredLabel from '@common/form/TestlabFormRequiredLabel';
import { getErrorMessage } from '@common/form/util';
import { isDefined } from '@common/util/validationUtils';
import { Textfield } from '@digdir/design-system-react';
import classnames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Path, PathValue, useFormContext } from 'react-hook-form';

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
  customError?: string;
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
  customError,
}: AutoCompleteProps<FormDataType, ResultDataType>) => {
  const { setValue, formState } = useFormContext<FormDataType>();
  const [showResultList, setShowResultList] = useState(false);
  const resultsRef = useRef<HTMLUListElement>(null);
  const [inputValueLabel, setInputValueLabel] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  useEffect(() => {
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
      setInputValueLabel(retainSelection ? result[resultLabelKey] : '');
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
      <Textfield
        label={<TestlabFormRequiredLabel label={label} required={required} />}
        description={description}
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
