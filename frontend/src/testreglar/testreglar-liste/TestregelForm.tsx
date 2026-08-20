import AlertTimed, { AlertProps } from '@common/alert/AlertTimed';
import TestlabForm from '@common/form/TestlabForm';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { isDefined } from '@common/util/validationUtils';
import { Link } from '@digdir/designsystemet-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { TESTREGEL_DEMO } from '@test/TestingRoutes';
import { Krav } from '@krav/types';
import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useParams } from 'react-router';
import styles from '../testreglar.module.scss';

import {
  InnhaldstypeTesting,
  Tema,
  Testobjekt,
  Testregel,
  TestregelInit,
} from '../api/types';
import {
  testreglarValidationSchema,
  TestregelFormInput,
  TestregelFormOutput,
} from './testreglarValidationSchema';
import {
  defineInnholdstypeOptions,
  defineKravOptions,
  defineModusOptions,
  defineSpraakOptions,
  defineTemaOptions,
  defineTestregelStatusOption,
  defineTypeOptions,
  defineTestobjectOptions,
} from '@testreglar/testreglar-liste/formOptionUtils.';
import {
  InputVersion,
  InnhaldstypeSelect,
  KravSelect,
  KravTilSamsvarTextArea,
  LangSelect,
  ModusSelect,
  NameTextArea,
  TemaSelect,
  TestobjektSelect,
  TestregelIdInput,
  TestregelSchemaTextArea,
  TestregelStatusSelect,
  TestregelTypeSelect,
  UtfallFieldArray,
  InstruksjonTextArea,
  HelptextTextArea,
} from '@testreglar/testreglar-liste/TestregelFormFields';

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
  const kravOptions = defineKravOptions(kravList);
  const modusOptions = defineModusOptions();
  const spraakOptions = defineSpraakOptions();
  const testregelStatusOptions = defineTestregelStatusOption();
  const typeOptions = defineTypeOptions();

  const innhaldsTypeOptions = defineInnholdstypeOptions(innhaldstypeList);
  const temaOptions = defineTemaOptions(temaList);
  const testobjektOptions = defineTestobjectOptions(testobjektList);

  const formMethods = useDefineFormMethods(testregel);

  const { control } = formMethods;

  const testregelType = useWatch({
    control,
    name: 'modus',
  });
  useWatch({
    control,
    name: 'type',
  });
  const showDemoLink =
    (testregelType === 'manuell' || testregelType === 'manuell-forenkla') && id;
  const isModusLocked = isDefined(testregel?.modus);

  const isManuellForenkla = testregelType === 'manuell-forenkla';

  return (
    <div className={styles.testregelForm}>
      <TestlabForm<TestregelFormInput, TestregelFormOutput>
        heading={heading}
        description={description}
        onSubmit={onSubmit}
        formMethods={formMethods}
      >
        <ModusSelect options={modusOptions} disabled={isModusLocked} />

        <NameTextArea />

        <TestregelIdInput />

        {!isManuellForenkla && (
          <TestregelSchemaTextArea testregelType={testregelType} />
        )}

        <KravSelect options={kravOptions} />

        <LangSelect options={spraakOptions} />

        <TestregelStatusSelect options={testregelStatusOptions} />

        <InputVersion />

        <TestregelTypeSelect options={typeOptions} />

        <InnhaldstypeSelect options={innhaldsTypeOptions} />

        <TemaSelect options={temaOptions} />

        <TestobjektSelect options={testobjektOptions} />

        <KravTilSamsvarTextArea />

        {isManuellForenkla && (
          <>
            <InstruksjonTextArea />

            <HelptextTextArea />

            <UtfallFieldArray />
          </>
        )}

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

function useDefineFormMethods(testregel: Testregel | undefined) {
  return useForm<TestregelFormInput, unknown, TestregelFormOutput>({
    defaultValues: {
      id: testregel?.id,
      testregelSchema: testregel?.testregelSchema || '',
      namn: testregel?.namn || '',
      kravId: testregel?.krav?.id || 1,
      modus: testregel?.modus || 'manuell',
      testregelId: testregel?.testregelId || '',
      versjon: testregel?.versjon || 1,
      status: testregel?.status || 'publisert',
      type: testregel?.type || 'nett',
      spraak: testregel?.spraak || 'nn',
      tema: testregel?.tema?.id,
      testobjekt: testregel?.testobjekt?.id,
      kravTilSamsvar: testregel?.kravTilSamsvar || '',
      innhaldstypeTesting: testregel?.innhaldstypeTesting?.id,
      definition: testregel?.definition,
    },
    resolver: zodResolver(testreglarValidationSchema),
  });
}
export default TestregelForm;
