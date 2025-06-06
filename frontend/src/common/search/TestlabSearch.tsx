import './testlab-search.scss';

import TestlabFormRequiredLabel from '@common/form/TestlabFormRequiredLabel';
import {
  Button,
  Textfield,
  TextfieldProps,
} from '@digdir/designsystemet-react';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';

export interface Props {
  required?: boolean;
  hidden?: boolean;
  numeric?: boolean;
  errorMessage?: string;
  searchText?: string;
  onClickSearch: (searchValue: string) => void;
}

const TestlabSearch = ({
  label,
  description,
  required = false,
  numeric = false,
  errorMessage,
  searchText = 'Søk',
  onClickSearch,
}: Props & TextfieldProps) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState(errorMessage);

  useEffect(() => {
    setError(errorMessage);
  }, [errorMessage]);

  const handleOnChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setError(undefined);
    setValue(e.target.value);
  }, []);

  const handleOnClickSearch = useCallback(() => {
    onClickSearch(value);
    setValue('');
  }, [value]);

  return (
    <div className="testlab__search">
      <div className="testlab__search-wrapper">
        <Textfield
          label={<TestlabFormRequiredLabel label={label} required={required} />}
          description={description}
          value={value}
          type={numeric ? 'number' : 'text'}
          id="testlab-search"
          onChange={handleOnChange}
          inputMode={numeric ? 'numeric' : 'text'}
          error={error}
          size={'small'}
        />
        <Button
          className="testlab__search-button"
          onClick={handleOnClickSearch}
        >
          {searchText}
        </Button>
      </div>
    </div>
  );
};

export default TestlabSearch;
