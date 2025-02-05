import TestlabForm from '@common/form/TestlabForm';
import TestlabFormCheckbox from '@common/form/TestlabFormCheckbox';
import TestlabFormInput from '@common/form/TestlabFormInput';
import TestlabFormSelect from '@common/form/TestlabFormSelect';
import TestlabFormTextArea from '@common/form/TestlabFormTextArea';
import {
  createOptionsFormEnum,
  createOptionsFromLiteral,
} from '@common/util/stringutils';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLoaderData } from 'react-router-dom';

import { updateKrav } from './api/krav-api';
import { kravValidationSchema } from './kravValidationSchema';
import {
  Krav,
  KravStatus,
  Samsvarsnivaa,
  WcagPrinsipp,
  WcagRetninglinje,
} from './types';

const KravApp = () => {
  const kravInit = useLoaderData() as Krav;

  const [krav, setKrav] = useState<Krav>(kravInit);

  const formMethods = useForm<Krav>({
    defaultValues: {
      id: krav.id,
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
      kommentarBrudd: krav.kommentarBrudd,
    },
    resolver: zodResolver(kravValidationSchema),
  });

  const onSubmit = useCallback((data: Krav) => {
    console.log(data);

    const update = async () => {
      data.id = krav.id;
      updateKrav(data).then((response) => setKrav(response));
    };
    update();
  }, []);

  return (
    <div className={'krav-form'}>
      <TestlabForm<Krav>
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
        />

        <TestlabFormCheckbox
          checkboxLabel="Gjeld app"
          label="Gjeld App"
          name="gjeldApp"
        />

        <TestlabFormCheckbox
          checkboxLabel="Gjeld Automat"
          label="Gjeld Automat"
          name="gjeldAutomat"
        />
        <TestlabFormSelect<KravStatus>
          id="kravStatus"
          options={createOptionsFormEnum(KravStatus)}
          label="Status krav"
          name="status"
          required
        />
        <TestlabFormSelect<KravStatus>
          id="prinsipp"
          options={createOptionsFormEnum(WcagPrinsipp)}
          label="Prinsipp"
          name="prinsipp"
          required
        />
        <TestlabFormSelect<KravStatus>
          id="retningslinje"
          options={createOptionsFormEnum(WcagRetninglinje)}
          label="Retningslinje"
          name="retningslinje"
          required
        />
        <TestlabFormSelect<KravStatus>
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

export default KravApp;
