import TestlabForm from '@common/form/TestlabForm';
import { Option } from '@common/types';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Testregel } from '../api/types';

export interface Props {
  heading: string;
  subHeading: string;
  onSubmit: (testregel: Testregel) => void;
  testregel?: Testregel;
  krav: string[];
  kravDisabled: boolean;
}

const TestreglarForm = ({
  heading,
  subHeading,
  onSubmit,
  testregel,
  krav,
  kravDisabled,
}: Props) => {
  const kravOptions: Option[] = krav.map((k) => ({
    label: k,
    value: k,
  }));

  const formMethods = useForm<Testregel>({
    defaultValues: {
      id: testregel?.id,
      testregelNoekkel: testregel?.testregelNoekkel ?? '',
      kravTilSamsvar: testregel?.kravTilSamsvar ?? '',
      krav: testregel?.krav,
    },
  });

  return (
    <div className="testregel-form">
      <TestlabForm<Testregel>
        heading={heading}
        subHeading={subHeading}
        onSubmit={onSubmit}
        formMethods={formMethods}
      >
        <TestlabForm.FormInput
          label="Namn"
          name="kravTilSamsvar"
          formValidation={{
            errorMessage: 'Namn kan ikkje vera tomt',
            validation: { required: true, minLength: 1 },
          }}
        />
        <TestlabForm.FormInput
          label="Testregel tekst-id"
          name="testregelNoekkel"
          formValidation={{
            errorMessage: 'Format på testregel er QW-ACT-RXX',
            validation: { required: true, pattern: /^(QW-ACT-R)[0-9]{1,2}$/i },
          }}
        />
        <TestlabForm.FormSelect
          label="Krav"
          options={kravOptions}
          name="krav"
          disabled={kravDisabled}
          formValidation={{
            errorMessage: 'Krav sak må vejast',
            validation: { required: true },
          }}
        />
        <TestlabForm.FormButtons />
      </TestlabForm>
    </div>
  );
};

export default TestreglarForm;
