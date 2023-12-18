import AlertTimed, { AlertProps } from '@common/alert/AlertTimed';
import TestlabForm from '@common/form/TestlabForm';
import TestlabFormInput from '@common/form/TestlabFormInput';
import TestlabFormSelect from '@common/form/TestlabFormSelect';
import { Option } from '@common/types';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { isDefined } from '@common/util/validationUtils';
import { Link } from '@digdir/design-system-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { TESTREGEL_DEMO } from '@test/TestingRoutes';
import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { Testregel, TestregelType } from '../api/types';
import { testreglarValidationSchema } from './testreglarValidationSchema';

export interface Props {
  heading: string;
  description: string;
  onSubmit: (testregel: Testregel) => void;
  testregel?: Testregel;
  krav: string[];
  kravDisabled: boolean;
  alert?: AlertProps;
}

const TestregelForm = ({
  heading,
  description,
  onSubmit,
  testregel,
  krav,
  kravDisabled,
  alert,
}: Props) => {
  const { id } = useParams();

  const kravOptions: Option[] = krav.map((k) => ({
    label: k,
    value: k,
  }));

  const typeOptions: Option[] = [
    {
      label: 'Manuell',
      value: 'manuell',
    },
    {
      label: 'Forenklet',
      value: 'forenklet',
    },
  ];

  const formMethods = useForm<Testregel>({
    defaultValues: {
      id: testregel?.id,
      testregelSchema: testregel?.testregelSchema ?? '',
      name: testregel?.name ?? '',
      krav: testregel?.krav,
      type: testregel?.type || 'manuell',
    },
    resolver: zodResolver(testreglarValidationSchema),
  });

  const { control } = formMethods;

  const testregelType = useWatch({
    control,
    name: 'type',
  }) as TestregelType;

  const showDemoLink = testregel && testregel.type === 'manuell' && id;

  return (
    <div className="testregel-form">
      <TestlabForm<Testregel>
        heading={heading}
        description={description}
        onSubmit={onSubmit}
        formMethods={formMethods}
      >
        <TestlabFormSelect
          radio
          name="type"
          options={typeOptions}
          label="Hvilken type testregel"
          size="small"
          disabled={isDefined(testregel?.type)}
        />
        <TestlabFormInput label="Namn" name="name" required textarea />
        <TestlabFormInput
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
          textarea={testregelType === 'manuell'}
          required
        />
        <TestlabFormSelect
          label="Krav"
          options={kravOptions}
          name="krav"
          disabled={kravDisabled}
          required
        />
        {showDemoLink && (
          <Link
            href={getFullPath(TESTREGEL_DEMO, { id: id, pathParam: idPath })}
          >
            Demo {testregel?.name}
          </Link>
        )}
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
