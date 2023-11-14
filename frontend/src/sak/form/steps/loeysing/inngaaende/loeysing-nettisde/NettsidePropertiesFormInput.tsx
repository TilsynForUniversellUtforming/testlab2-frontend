import TestlabFormInput from '@common/form/TestlabFormInput';
import { isDefined } from '@common/util/validationUtils';
import {
  Heading,
  Select,
  SingleSelectOption,
} from '@digdir/design-system-react';
import { SakFormState } from '@sak/types';
import { useCallback, useState } from 'react';
import { Path, useFormContext } from 'react-hook-form';

interface Props {
  heading: string;
  nameUrl: Path<SakFormState>;
  nameReason: Path<SakFormState>;
  nameDescription: Path<SakFormState>;
  options: SingleSelectOption[];
}

const NettsidePropertiesFormInput = ({
  heading,
  nameUrl,
  nameReason,
  nameDescription,
  options,
}: Props) => {
  const [optionSelected, setOptionSelected] = useState<boolean>(false);
  const { setValue } = useFormContext<SakFormState>();
  const onChange = useCallback((option: string) => {
    if (isDefined(option)) {
      setValue(nameDescription, option);
      setOptionSelected(true);
    } else {
      setOptionSelected(false);
    }
  }, []);

  return (
    <div className="sak-loeysing__nettsted-props-entry">
      <Heading size="xsmall" level={6}>
        {heading}
      </Heading>
      <TestlabFormInput<SakFormState>
        label="Url til side"
        name={nameUrl}
        required
      />
      <TestlabFormInput<SakFormState>
        label="Begrunnelse for sidevalg"
        name={nameReason}
        required
      />
      <TestlabFormInput<SakFormState>
        label="Beskrivelse av siden"
        name={nameDescription}
        disabled={optionSelected}
        required
      />
      <Select
        label="Standardside (valgfritt)"
        options={options}
        onChange={onChange}
      />
    </div>
  );
};

export default NettsidePropertiesFormInput;
