import TestlabForm from '@common/form/TestlabForm';
import { ErrorMessage } from '@digdir/design-system-react';
import React, { useEffect } from 'react';
import { FieldErrors, UseFormWatch } from 'react-hook-form';
import {
  UseFormClearErrors,
  UseFormSetError,
} from 'react-hook-form/dist/types/form';

import { SakFormState } from '../../../types';

export interface Props {
  watch: UseFormWatch<SakFormState>;
  setError: UseFormSetError<SakFormState>;
  clearErrors: UseFormClearErrors<SakFormState>;
  errors: FieldErrors<SakFormState>;
}

const SakCrawlParameters = ({
  watch,
  setError,
  clearErrors,
  errors,
}: Props) => {
  watch(['maxLinksPerPage', 'numLinksToSelect']);

  useEffect(() => {
    const subscription = watch((value) => {
      const maxLinksPerPage = Number(value.maxLinksPerPage);
      const numLinksToSelect = Number(value.numLinksToSelect);

      if (
        !maxLinksPerPage ||
        isNaN(maxLinksPerPage) ||
        maxLinksPerPage < 10 ||
        maxLinksPerPage > 2000
      ) {
        setError('maxLinksPerPage', {
          type: 'manual',
          message: 'Nettsider må være mellom 10 og 2000',
        });
      }

      if (
        !numLinksToSelect ||
        isNaN(numLinksToSelect) ||
        numLinksToSelect < 10 ||
        numLinksToSelect > 2000
      ) {
        setError('numLinksToSelect', {
          type: 'manual',
          message: 'Utval må være mellom 10 og 2000',
        });
      }

      if (maxLinksPerPage <= numLinksToSelect) {
        setError('numLinksToSelect', {
          type: 'manual',
          message:
            'Butto-utval av nettsider må væra større eller likt netto-utval',
        });
      } else {
        clearErrors('numLinksToSelect');
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setError, clearErrors]);

  return (
    <div className="sak__crawl-wrapper">
      <div className="sak__crawl-input">
        <TestlabForm.FormInput<SakFormState>
          label="Nettsider til sideutval (brutto-utval)"
          name="maxLinksPerPage"
        />
      </div>
      {errors?.maxLinksPerPage && (
        <ErrorMessage>{errors?.maxLinksPerPage?.message}</ErrorMessage>
      )}
      <div className="sak__crawl-input">
        <TestlabForm.FormInput<SakFormState>
          label="Nettsider som blir valde frå utval (netto-utval)"
          name="numLinksToSelect"
        />
      </div>
      {errors?.numLinksToSelect && (
        <ErrorMessage>{errors?.numLinksToSelect?.message}</ErrorMessage>
      )}
    </div>
  );
};

export default SakCrawlParameters;
