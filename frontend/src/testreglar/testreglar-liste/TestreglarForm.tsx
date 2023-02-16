import React from 'react';
import { useForm } from 'react-hook-form';

import TestlabForm from '../../common/form/TestlabForm';
import { Option } from '../../common/types';
import { enumToOptions } from '../../common/util/util';
import { Krav } from '../../krav/types';
import { Testregel, TestStatus, TestType } from '../api/types';

export interface Props {
  label: string;
  onSubmit: (testregel: Testregel) => void;
  testregel?: Testregel;
  krav: Krav[];
}

const TestreglarForm = ({ label, onSubmit, testregel, krav }: Props) => {
  const defaultStatusOption: Option = {
    label: 'Ingen status valgt',
    value: '0',
  };
  const statusOptions: Option[] = enumToOptions(TestStatus);
  statusOptions.unshift(defaultStatusOption);

  const defaultTypeOption: Option = {
    label: 'Ingen type valgt',
    value: '0',
  };
  const typeOptions: Option[] = enumToOptions(TestType);
  typeOptions.unshift(defaultTypeOption);

  const defaultKravOption: Option = {
    label: 'Ingen krav valgt',
    value: '0',
  };
  const kravOptions: Option[] = krav.map((k) => ({
    label: k.tittel,
    value: String(k.id),
  }));
  kravOptions.unshift(defaultKravOption);

  const formMethods = useForm<Testregel>({
    defaultValues: {
      id: testregel?.id,
      kravId: testregel?.kravId ?? 0,
      referanseAct: testregel?.referanseAct ?? '',
      kravTilSamsvar: testregel?.kravTilSamsvar ?? '',
      type: testregel?.type,
      status: testregel?.status,
      kravTittel: testregel?.kravTittel,
    },
  });

  return (
    <TestlabForm<Testregel>
      label={label}
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
      <TestlabForm.FormSelect
        label="Status"
        name="status"
        options={statusOptions}
        formValidation={{
          errorMessage: 'Status må velges',
          validation: { required: true, min: '1' },
        }}
      />
      <TestlabForm.FormSelect
        label="Type"
        options={typeOptions}
        name="type"
        formValidation={{
          errorMessage: 'Type må velges',
          validation: { required: true, min: '1' },
        }}
      />
      <TestlabForm.FormInput
        label="Testregel"
        name="referanseAct"
        formValidation={{
          errorMessage: 'Format på testregel er QW-ACT-RXX',
          validation: { pattern: /^(QW-ACT-R)[0-9]{1,2}$/i },
        }}
      />
      <TestlabForm.FormSelect
        label="Krav"
        options={kravOptions}
        name="kravId"
      />
    </TestlabForm>
  );
};

export default TestreglarForm;
