import AlertTimed, { AlertProps } from '@common/alert/AlertTimed';
import TestlabForm from '@common/form/TestlabForm';
import TestlabFormInput from '@common/form/TestlabFormInput';
import TestlabFormSelect from '@common/form/TestlabFormSelect';
import TestlabFormTextArea from '@common/form/TestlabFormTextArea';
import { OptionType } from '@common/types';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { createOptionsFromLiteral } from '@common/util/stringutils';
import { isDefined } from '@common/util/validationUtils';
import { Link } from '@digdir/design-system-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { TESTREGEL_DEMO } from '@test/TestingRoutes';
import { Krav } from 'krav/types';
import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import {
  InnhaldstypeTesting,
  Tema,
  Testobjekt,
  Testregel,
  TestregelInit,
  TestregelInnholdstype,
  TestregelModus,
  TestregelStatus,
} from '../api/types';
import { testreglarValidationSchema } from './testreglarValidationSchema';

export interface Props {
  heading: string;
  description: string;
  onSubmit: (testregel: TestregelInit) => void;
  testregel?: Testregel;
  innhaldstypeList: InnhaldstypeTesting[];
  temaList: Tema[];
  testobjektList: Testobjekt[];
  kravList: Krav[];
  alert?: AlertProps;
}

const TestregelForm = ({
  heading,
  description,
  onSubmit,
  testregel,
  innhaldstypeList,
  temaList,
  testobjektList,
  kravList,
  alert,
}: Props) => {
  const { id } = useParams();
  const kravOptions: OptionType[] = kravList.map((k) => ({
    label: k.tittel,
    value: String(k.id),
  }));

  const modusOptions: OptionType[] = createOptionsFromLiteral<TestregelModus>([
    'forenklet',
    'manuell',
  ]);
  const spraakOptions: OptionType[] = [
    { value: 'nn', label: 'Norsk nynorsk' },
    { value: 'nb', label: 'Norsk bokmål' },
    { value: 'en', label: 'Engelsk' },
  ];
  const testregelStatusOptions: OptionType[] =
    createOptionsFromLiteral<TestregelStatus>([
      'ikkje_starta',
      'under_arbeid',
      'gjennomgaatt_workshop',
      'klar_for_testing',
      'treng_avklaring',
      'ferdig_testa',
      'klar_for_kvalitetssikring',
      'publisert',
      'utgaar',
    ]);
  const typeOptions = createOptionsFromLiteral<TestregelInnholdstype>([
    'app',
    'nett',
    'automat',
    'dokument',
  ]);

  const innhaldsTypeOptions: OptionType[] = innhaldstypeList.map((it) => ({
    label: it.innhaldstype,
    value: String(it.id),
  }));

  const temaOptions: OptionType[] = temaList.map((it) => ({
    label: it.tema,
    value: String(it.id),
  }));

  const testobjektOptions: OptionType[] = testobjektList.map((it) => ({
    label: it.testobjekt,
    value: String(it.id),
  }));

  const formMethods = useForm<TestregelInit>({
    defaultValues: {
      id: testregel?.id,
      testregelSchema: testregel?.testregelSchema || '',
      namn: testregel?.namn || '',
      krav: testregel?.krav,
      modus: testregel?.modus || 'manuell',
      testregelId: testregel?.testregelId || '',
      versjon: testregel?.versjon || 1,
      status: testregel?.status || 'ikkje_starta',
      type: testregel?.type || 'nett',
      spraak: testregel?.spraak || 'nn',
      tema: testregel?.tema?.id,
      testobjekt: testregel?.testobjekt?.id,
      kravTilSamsvar: testregel?.kravTilSamsvar || '',
      innhaldstypeTesting: testregel?.innhaldstypeTesting?.id,
    },
    resolver: zodResolver(testreglarValidationSchema),
  });

  const { control } = formMethods;

  const testregelType = useWatch({
    control,
    name: 'modus',
  }) as TestregelModus;

  const showDemoLink = testregel && testregel.modus === 'manuell' && id;

  return (
    <div className="testregel-form">
      <TestlabForm<TestregelInit>
        heading={heading}
        description={description}
        onSubmit={onSubmit}
        formMethods={formMethods}
      >
        <TestlabFormSelect
          radio
          name="modus"
          options={modusOptions}
          label={`Type testregel${isDefined(testregel?.modus) ? ' (kan ikkje endrast)' : ''}`}
          size="small"
          disabled={isDefined(testregel?.modus)}
          required
        />
        <TestlabFormTextArea label="Namn" name="namn" required />
        <TestlabFormInput label="Testregel-id" name="testregelId" required />
        <TestlabFormTextArea
          label={
            testregelType === 'manuell'
              ? 'WCAG testregel'
              : 'QualWeb regel-id (unik)'
          }
          description={
            testregelType === 'manuell'
              ? 'Testregel må være i gyldig JSON-format'
              : ''
          }
          name="testregelSchema"
          required
        />
        <TestlabFormSelect
          label="Krav"
          options={kravOptions}
          name="krav.id"
          required
        />
        <TestlabFormSelect
          options={spraakOptions}
          label="Språk"
          name="spraak"
          required
        />
        <TestlabFormSelect
          options={testregelStatusOptions}
          label="Status"
          name="status"
          required
        />
        <TestlabFormInput
          label="Versjon"
          name="versjon"
          type="number"
          required
        />
        <TestlabFormSelect
          options={typeOptions}
          label="Type"
          name="type"
          required
        />
        <TestlabFormSelect
          options={innhaldsTypeOptions}
          label="Innhaldstype"
          name="innhaldstypeTesting"
        />
        <TestlabFormSelect options={temaOptions} label="Tema" name="tema" />
        <TestlabFormSelect
          options={testobjektOptions}
          label="Testobjekt"
          name="testobjekt"
        />
        <TestlabFormTextArea label="Krav til samsvar" name="kravTilSamsvar" />
        {showDemoLink && (
          <Link
            href={getFullPath(TESTREGEL_DEMO, { id: id, pathParam: idPath })}
          >
            Demo {testregel?.namn}
          </Link>
        )}
        {alert && (
          <AlertTimed
            severity={alert.severity}
            message={alert.message}
            clearMessage={alert.clearMessage}
          />
        )}
        <TestlabForm.FormButtons />
      </TestlabForm>
    </div>
  );
};

export default TestregelForm;
