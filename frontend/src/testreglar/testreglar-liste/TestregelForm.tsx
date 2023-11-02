import AlertTimed, { AlertProps } from '@common/alert/AlertTimed';
import TestlabForm from '@common/form/TestlabForm';
import { Option } from '@common/types';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Testregel } from '../api/types';
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

  const formMethods = useForm<Testregel>({
    defaultValues: {
      id: testregel?.id,
      testregelNoekkel: testregel?.testregelNoekkel ?? '',
      kravTilSamsvar: testregel?.kravTilSamsvar ?? '',
      krav: testregel?.krav,
    },
    resolver: zodResolver(testreglarValidationSchema),
  });

  return (
    <div className="testregel-form">
      <TestlabForm<Testregel>
        heading={heading}
        description={subHeading}
        onSubmit={onSubmit}
        formMethods={formMethods}
      >
        <TestlabForm.FormInput label="Namn" name="kravTilSamsvar" required />
        <TestlabForm.FormInput
          label="Testregel test-id (unik)"
          name="testregelNoekkel"
          required
        />
        <TestlabForm.FormSelect
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
