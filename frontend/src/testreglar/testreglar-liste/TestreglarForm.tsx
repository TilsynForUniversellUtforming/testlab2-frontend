import React from 'react';
import { useForm } from 'react-hook-form';

import TestlabForm from '../../common/form/TestlabForm';
import { Option } from '../../common/types';
import { Testregel } from '../api/types';

export interface Props {
  label: string;
  onSubmit: (testregel: Testregel) => void;
  testregel?: Testregel;
  krav: string[];
  kravDisabled: boolean;
}

const TestreglarForm = ({
  label,
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
      referanseAct: testregel?.referanseAct ?? '',
      kravTilSamsvar: testregel?.kravTilSamsvar ?? '',
      krav: testregel?.krav,
    },
  });

  return (
    <div className="testregel-form">
      <TestlabForm<Testregel>
        heading={label}
        onSubmit={onSubmit}
        formMethods={formMethods}
      >
        <TestlabForm.FormInput
          label="Navn"
          name="kravTilSamsvar"
          formValidation={{
            errorMessage: 'Navn kan ikke være tomt',
            validation: { required: true, minLength: 1 },
          }}
        />
        <TestlabForm.FormInput
          label="Testregel"
          name="referanseAct"
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
