import AlertTimed, { AlertProps } from '@common/alert/AlertTimed';
import TestlabForm from '@common/form/TestlabForm';
import TestlabFormInput from '@common/form/TestlabFormInput';
import TestlabFormSelect from '@common/form/TestlabFormSelect';
import { Option } from '@common/types';
import { isDefined } from '@common/util/validationUtils';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { Testregel, TestregelType } from '../api/types';
import { testreglarValidationSchema } from './testreglarValidationSchema';

export interface Props {
  heading: string;
  subHeading?: string;
  onSubmit: (testregel: Testregel) => void;
  testregel?: Testregel;
  krav: string[];
  kravDisabled: boolean;
  alert?: AlertProps;
}

const TestregelForm = ({
  heading,
  subHeading,
  onSubmit,
  testregel,
  krav,
  kravDisabled,
  alert,
}: Props) => {
  const kravOptions: Option[] = krav.map((k) => ({
    label: k,
    value: k,
  }));

  const typeOptions: Option[] = [
    {
      label: 'Inngående kontroll',
      value: 'inngaaende',
    },
    {
      label: 'Forenklet kontroll',
      value: 'forenklet',
    },
  ];

  const formMethods = useForm<Testregel>({
    defaultValues: {
      id: testregel?.id,
      testregelSchema: testregel?.testregelSchema ?? '',
      name: testregel?.name ?? '',
      krav: testregel?.krav,
      type: testregel?.type || 'inngaaende',
    },
    resolver: zodResolver(testreglarValidationSchema),
  });

  const { control } = formMethods;

  const testregelType = useWatch({
    control,
    name: 'type',
  }) as TestregelType;

  return (
    <div className="testregel-form">
      <TestlabForm<Testregel>
        heading={heading}
        description={subHeading}
        onSubmit={onSubmit}
        formMethods={formMethods}
      >
        <TestlabFormSelect
          radio
          name="type"
          options={typeOptions}
          label="Hvilken type testregel"
          size="small"
          disabled={isDefined(testregel?.type)}
        />
        <TestlabFormInput label="Namn" name="name" required textarea />
        <TestlabFormInput
          label={
            testregelType === 'inngaaende'
              ? 'WCAG testregel'
              : 'QualWeb regel-id (unik)'
          }
          description={
            testregelType === 'inngaaende'
              ? 'Testregel må være i gyldig JSON-format'
              : ''
          }
          name="testregelSchema"
          textarea={testregelType === 'inngaaende'}
          required
        />
        <TestlabFormSelect
          label="Krav"
          options={kravOptions}
          name="krav"
          disabled={kravDisabled}
          required
        />
        <TestlabForm.FormButtons />
      </TestlabForm>
      {alert && (
        <AlertTimed
          severity={alert.severity}
          message={alert.message}
          clearMessage={alert.clearMessage}
        />
      )}
    </div>
  );
};

export default TestregelForm;
