import TestlabForm from '@common/form/TestlabForm';
import TestlabFormCheckbox from '@common/form/TestlabFormCheckbox';
import TestlabFormInput from '@common/form/TestlabFormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useLoaderData } from 'react-router-dom';

import { kravValidationSchema } from './kravValidationSchema';
import { Krav, KravInit } from './types';

const KravApp = () => {
  const krav = useLoaderData() as Krav;

  console.log('Krav ' + JSON.stringify(krav));

  const formMethods = useForm<KravInit>({
    defaultValues: {
      tittel: krav.tittel,
      suksesskriterium: krav.suksesskriterium,
      gjeldNettsider: krav.gjeldNettsider,
      gjeldApp: krav.gjeldApp,
      gjeldAutomat: krav.gjeldAutomat,
      prinsipp: krav.prinsipp,
      retningslinje: krav.retningslinje,
      samsvarsnivaa: krav.samsvarsnivaa,
      status: krav.status,
      urlRettleiing: krav.urlRettleiing,
      innhald: krav.innhald,
    },
    resolver: zodResolver(kravValidationSchema),
  });

  return (
    <div className={'krav-form'}>
      <TestlabForm<KravInit> formMethods={formMethods}>
        <TestlabFormInput label="Tittel" name="tittel" required />
        <TestlabFormInput
          label="Suksesskriterium"
          name="suksesskriterium"
          required
        />
        <TestlabFormCheckbox
          checkboxLabel="Gjeld nettsider"
          label="Gjeld Nettsider"
          name="gjeldNettsider"
        />
        <TestlabFormCheckbox
          checkboxLabel="Gjeld Automat"
          label="Gjeld Automat"
          name="gjeldAutomat"
        />
      </TestlabForm>
    </div>
  );
};

export default KravApp;
