import './loeysing-form.scss';

import AlertTimed, { AlertProps } from '@common/alert/AlertTimed';
import TestlabForm, { TestlabFormProps } from '@common/form/TestlabForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { loeysingValidationSchema } from '@loeysingar/form/loeysingValidationSchema';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Loeysing, LoeysingInit } from '../api/types';

export interface Props
  extends Omit<TestlabFormProps<LoeysingInit>, 'children' | 'formMethods'> {
  loeysing?: Loeysing;
  alert?: AlertProps;
}

const LoeysingForm = ({
  loeysing,
  alert,
  heading,
  description,
  onSubmit,
}: Props) => {
  const formMethods = useForm<LoeysingInit>({
    defaultValues: {
      namn: loeysing?.namn ?? '',
      url: loeysing?.url ?? '',
      organisasjonsnummer: loeysing?.orgnummer ?? '',
      verksemdId: loeysing?.verksemdId ?? 0,
    },
    resolver: zodResolver(loeysingValidationSchema),
  });

  return (
    <div className="loeysing-form">
      <TestlabForm<LoeysingInit>
        heading={heading}
        description={description}
        onSubmit={onSubmit}
        formMethods={formMethods}
        hasRequiredFields
      >
        <div className="loeysing-form__input">
          <TestlabForm.FormInput<LoeysingInit>
            label="Namn"
            name="namn"
            required
          />
        </div>
        <div className="loeysing-form__input">
          <TestlabForm.FormInput<LoeysingInit>
            label="Url"
            name="url"
            required
          />
        </div>
        <div className="loeysing-form__input">
          <TestlabForm.FormInput<LoeysingInit>
            label="Organisasjonsnummer"
            name="organisasjonsnummer"
            required
          />
        </div>
        <div className="loeysing-form__submit">
          <TestlabForm.FormButtons />
        </div>
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

export default LoeysingForm;
