import {
  KravInit,
  KravStatus,
  Samsvarsnivaa,
  WcagPrinsipp,
  WcagRetninglinje,
} from './types';
import TestlabForm from '@common/form/TestlabForm';
import TestlabFormInput from '@common/form/TestlabFormInput';
import TestlabFormTextArea from '@common/form/TestlabFormTextArea';
import TestlabFormCheckbox from '@common/form/TestlabFormCheckbox';
import TestlabFormSelect from '@common/form/TestlabFormSelect';
import {
  createOptionsFormEnum,
  createOptionsFromLiteral,
} from '@common/util/stringutils';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { kravValidationSchema } from './kravValidationSchema';

export interface KravFormProps<T extends object> {
  krav?: KravInit;
  onSubmit: SubmitHandler<T>;
}

const KravForm = <T extends object>({ krav, onSubmit }: KravFormProps<T>) => {
  const formMethods = useForm<KravInit>({
    defaultValues: {
      tittel: krav?.tittel,
      status: krav?.status,
      innhald: krav?.innhald,
      gjeldNettsider: krav?.gjeldNettsider,
      gjeldApp: krav?.gjeldApp,
      gjeldAutomat: krav?.gjeldAutomat,
      prinsipp: krav?.prinsipp,
      retningslinje: krav?.retningslinje,
      suksesskriterium: krav?.suksesskriterium,
      samsvarsnivaa: krav?.samsvarsnivaa,
      urlRettleiing: krav?.urlRettleiing,
      kommentarBrudd: krav?.kommentarBrudd,
    },
    resolver: zodResolver(kravValidationSchema),
  });

  return (
    <div className={'krav-form'}>
      <TestlabForm<KravInit>
        formMethods={formMethods}
        heading={'Endre krav'}
        onSubmit={onSubmit}
      >
        <TestlabFormInput label="Tittel" name="tittel" required />
        <TestlabFormInput
          label="Suksesskriterium"
          name="suksesskriterium"
          required
        />

        <TestlabFormTextArea label="Innhald" name="innhald" required />

        <TestlabFormCheckbox
          checkboxLabel="Gjeld nettsider"
          label="Gjeld Nettsider"
          name="gjeldNettsider"
          required={false}
        />

        <TestlabFormCheckbox
          checkboxLabel="Gjeld app"
          label="Gjeld App"
          name="gjeldApp"
          required={false}
        />

        <TestlabFormCheckbox
          checkboxLabel="Gjeld Automat"
          label="Gjeld Automat"
          name="gjeldAutomat"
          required={false}
        />
        <TestlabFormSelect
          id="kravStatus"
          options={createOptionsFormEnum(KravStatus)}
          label="Status krav"
          name="status"
          required
        />
        <TestlabFormSelect
          id="prinsipp"
          options={createOptionsFormEnum(WcagPrinsipp)}
          label="Prinsipp"
          name="prinsipp"
          required
        />
        <TestlabFormSelect
          id="retningslinje"
          options={createOptionsFormEnum(WcagRetninglinje)}
          label="Retningslinje"
          name="retningslinje"
          required
        />
        <TestlabFormSelect
          id="samsvarsnivaa"
          options={createOptionsFromLiteral<Samsvarsnivaa>(['A', 'AA', 'AAA'])}
          label="Samsvarsnivaa"
          name="samsvarsnivaa"
          required
        />
        <TestlabFormInput
          label="Url rettleiing"
          name="urlRettleiing"
          required
        />

        <TestlabFormTextArea
          label="Kommentar til brudd"
          name="kommentarBrudd"
          required={false}
        />
        <TestlabForm.FormButtons />
      </TestlabForm>
    </div>
  );
};

export default KravForm;
