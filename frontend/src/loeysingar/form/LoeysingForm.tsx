import './loeysing-form.scss';

import TestlabForm, { TestlabFormProps } from '@common/form/TestlabForm';
import { isOrgnummer, isUrl } from '@common/util/util';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Loeysing, LoeysingInit } from '../api/types';

export interface Props
  extends Omit<TestlabFormProps<LoeysingInit>, 'children' | 'formMethods'> {
  loeysing?: Loeysing;
}

const LoeysingForm = ({ loeysing, heading, subHeading, onSubmit }: Props) => {
  const formMethods = useForm<LoeysingInit>({
    defaultValues: {
      namn: loeysing?.namn ?? '',
      url: loeysing?.url ?? '',
      organisasjonsnummer: loeysing?.orgnummer ?? '',
    },
  });

  return (
    <div className="loeysing-form">
      <TestlabForm<LoeysingInit>
        heading={heading}
        subHeading={subHeading}
        onSubmit={onSubmit}
        formMethods={formMethods}
        hasRequiredFields
      >
        <div className="loeysing-form__input">
          <TestlabForm.FormInput<LoeysingInit>
            label="Namn"
            name="namn"
            formValidation={{
              errorMessage: 'Namn kan ikkje væra tomt',
              validation: { required: true, minLength: 1 },
            }}
          />
        </div>
        <div className="loeysing-form__input">
          <TestlabForm.FormInput<LoeysingInit>
            label="Url"
            name="url"
            formValidation={{
              errorMessage:
                'Ugyldig format, skal være på formatet https://www.uutilsynet.no/',
              validation: {
                validate: isUrl,
                required: true,
              },
            }}
          />
        </div>
        <div className="loeysing-form__input">
          <TestlabForm.FormInput<LoeysingInit>
            label="Organisasjonsnummer"
            name="organisasjonsnummer"
            formValidation={{
              validation: {
                validate: isOrgnummer,
                required: true,
              },
              errorMessage: 'Dette er ikkje eit gyldig organisasjonsnummer',
            }}
          />
        </div>
        <div className="loeysing-form__submit">
          <TestlabForm.FormButtons />
        </div>
      </TestlabForm>
    </div>
  );
};

export default LoeysingForm;
