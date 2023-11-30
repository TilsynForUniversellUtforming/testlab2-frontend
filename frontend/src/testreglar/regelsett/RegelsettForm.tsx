import AlertTimed, { AlertProps } from '@common/alert/AlertTimed';
import TestlabForm from '@common/form/TestlabForm';
import TestlabFormCheckbox from '@common/form/TestlabFormCheckbox';
import TestlabFormInput from '@common/form/TestlabFormInput';
import TestlabFormSelect from '@common/form/TestlabFormSelect';
import { getErrorMessage } from '@common/form/util';
import { getCheckboxColumn } from '@common/table/control/toggle/CheckboxColumn';
import TestlabTable from '@common/table/TestlabTable';
import { Option } from '@common/types';
import { isDefined } from '@common/util/validationUtils';
import { zodResolver } from '@hookform/resolvers/zod';
import { ColumnDef, Row } from '@tanstack/react-table';
import { regelsettValidationSchema } from '@testreglar/regelsett/regelsettValidationSchema';
import React, { useCallback, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useOutletContext } from 'react-router-dom';

import { Regelsett, Testregel, TestregelType } from '../api/types';
import { TestregelContext } from '../types';

export interface Props {
  heading: string;
  description: string;
  regelsett?: Regelsett;
  onSubmit: (testregel: Regelsett) => void;
  alert?: AlertProps;
}

const RegelsettForm = ({
  heading,
  description,
  regelsett,
  onSubmit,
  alert,
}: Props) => {
  const formMethods = useForm<Regelsett>({
    defaultValues: {
      id: regelsett?.id,
      namn: regelsett?.namn || '',
      standard: regelsett?.standard || false,
      type: regelsett?.type || 'inngaaende',
      testregelList: regelsett?.testregelList || [],
    },
    resolver: zodResolver(regelsettValidationSchema),
  });

  const { control, setValue } = formMethods;
  const {
    contextError,
    contextLoading,
    testregelList,
    refresh,
  }: TestregelContext = useOutletContext();

  const regelsettType = useWatch({
    control,
    name: 'type',
  }) as TestregelType;

  const onChangeRows = useCallback((rowSelection: Testregel[]) => {
    setValue('testregelList', rowSelection);
  }, []);

  const typeOptions: Option[] = [
    {
      label: 'Inngående kontroll',
      value: 'inngaaende',
    },
    {
      label: 'Forenklet kontroll',
      value: 'forenklet',
    },
  ];

  const selectableTestreglar = testregelList.filter(
    (tr) => tr.type === regelsettType
  );

  const selectedRows = useMemo(() => {
    const rowArray = new Array(selectableTestreglar.length);

    regelsett?.testregelList.forEach((tr) => {
      const index = selectableTestreglar.findIndex(
        (selectableTr) => selectableTr.id === tr.id
      );
      if (index !== -1) {
        rowArray[index] = true;
      }
    });

    return rowArray;
  }, [selectableTestreglar, regelsett?.testregelList]);

  const testRegelColumns = useMemo<ColumnDef<Testregel>[]>(
    () => [
      getCheckboxColumn(
        (row: Row<Testregel>) => `Velg ${row.original.name}`,
        true
      ),
      {
        accessorFn: (row) => row.name,
        id: 'Namn',
        cell: (info) => info.getValue(),
        header: () => <>Namn</>,
      },
      {
        accessorFn: (row) => row.krav,
        id: 'krav',
        cell: (info) => info.getValue(),
        header: () => <>Krav</>,
        meta: {
          select: true,
        },
      },
    ],
    []
  );

  const tableError = getErrorMessage(formMethods.formState, 'testregelList');

  return (
    <div className="testregel-form">
      <TestlabForm<Regelsett>
        heading={heading}
        description={description}
        onSubmit={onSubmit}
        formMethods={formMethods}
      >
        <TestlabFormInput label="Namn" name="namn" required />
        <TestlabFormSelect
          radio
          name="type"
          options={typeOptions}
          label="Type"
          description="Bestemmer om regelsettet for forenkla eller inngåande kontrollar"
          disabled={isDefined(regelsett?.type)}
          required
        />
        <TestlabFormCheckbox
          label="Standard"
          description="Bestemmer om regelsettet skal komma opp som det standard regelsettet ein bruker i samband med å opprett saker"
          checkboxLabel="Standard regelsett"
          name="standard"
        />
        <TestlabTable<Testregel>
          data={selectableTestreglar}
          defaultColumns={testRegelColumns}
          displayError={{ error: contextError }}
          loading={contextLoading}
          selectedRows={selectedRows}
          onSelectRows={onChangeRows}
          onClickRetry={refresh}
          customStyle={{ small: true }}
          actionRequiredError={tableError}
        />
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

export default RegelsettForm;
