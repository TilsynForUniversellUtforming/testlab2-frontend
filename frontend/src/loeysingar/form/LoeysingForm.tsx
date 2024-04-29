import './loeysing-form.scss';

import AlertTimed, { AlertProps } from '@common/alert/AlertTimed';
import TestlabFormAutocomplete from '@common/form/autocomplete/TestlabFormAutocomplete';
import TestlabForm, { TestlabFormProps } from '@common/form/TestlabForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { loeysingValidationSchema } from '@loeysingar/form/loeysingValidationSchema';
import { Verksemd } from '@verksemder/api/types';
import useVerksemdAutocomplete from '@verksemder/useVerksemdAutocomplete';
import React from 'react';
import { useForm } from 'react-hook-form';

import { LoeysingFormElement, LoeysingInit } from '../api/types';

export interface Props
  extends Omit<TestlabFormProps<LoeysingInit>, 'children' | 'formMethods'> {
  loeysing?: LoeysingFormElement;
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
      verksemd: loeysing?.verksemd,
    },
    resolver: zodResolver(loeysingValidationSchema),
  });

  const { verksemdAutocompleteList, onChangeAutocomplete } =
    useVerksemdAutocomplete();

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
        <div className="loeysing-form__input">
          <TestlabForm.FormInput<LoeysingInit>
            label="Verksemd"
            name="verksemd.namn"
            disabled
          />
        </div>

        <div className="loeysing-form__input">
          <TestlabFormAutocomplete<LoeysingInit, Verksemd>
            label="Verksemd"
            description="Søk etter namn, orgnr"
            resultList={verksemdAutocompleteList}
            resultLabelKey="namn"
            resultDescriptionKey="organisasjonsnummer"
            onChange={onChangeAutocomplete}
            retainLabelValueChange={false}
            hideErrors
            name="verksemd"
            size="small"
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
