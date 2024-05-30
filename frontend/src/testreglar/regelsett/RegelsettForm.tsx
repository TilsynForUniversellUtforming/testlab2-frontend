import AlertTimed, { AlertProps } from '@common/alert/AlertTimed';
import TestlabForm from '@common/form/TestlabForm';
import TestlabFormCheckbox from '@common/form/TestlabFormCheckbox';
import TestlabFormInput from '@common/form/TestlabFormInput';
import TestlabFormSelect from '@common/form/TestlabFormSelect';
import { getErrorMessage } from '@common/form/util';
import { getCheckboxColumn } from '@common/table/control/toggle/CheckboxColumn';
import TestlabTable from '@common/table/TestlabTable';
import { OptionType } from '@common/types';
import { sanitizeEnumLabel } from '@common/util/stringutils';
import { isDefined } from '@common/util/validationUtils';
import { Chip, Heading } from '@digdir/designsystemet-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ColumnDef, Row } from '@tanstack/react-table';
import { filterList } from '@testreglar/api/util';
import { regelsettValidationSchema } from '@testreglar/regelsett/regelsettValidationSchema';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useOutletContext } from 'react-router-dom';

import {
  Regelsett,
  TestregelBase,
  TestregelInnholdstype,
  TestregelModus,
} from '../api/types';
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
      modus: regelsett?.modus || 'manuell',
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

  const modus = useWatch({
    control,
    name: 'modus',
  }) as TestregelModus;

  const [type, setType] = useState<TestregelInnholdstype | undefined>();
  const [selectableTestreglar, setSelectableTestreglar] = useState<
    TestregelBase[]
  >(filterList(testregelList, modus));

  const onChangeRows = useCallback((rowSelection: TestregelBase[]) => {
    setValue('testregelList', rowSelection);
  }, []);

  const typeOptions: OptionType[] = [
    {
      label: 'Manuell',
      value: 'manuell',
    },
    {
      label: 'Automatisk',
      value: 'automatisk',
    },
    {
      label: 'Semi-automatisk',
      value: 'semi-automatisk',
    },
  ];

  const selectedRows = useMemo(() => {
    const rowArray = new Array(selectableTestreglar.length);

    regelsett?.testregelList.forEach((tr) => {
      const index = selectableTestreglar.findIndex(
        (selectableTr) => selectableTr.id === tr.id
      );
      rowArray[index] = index !== -1;
    });

    return rowArray;
  }, [selectableTestreglar, regelsett?.testregelList]);

  const testRegelColumns = useMemo<ColumnDef<TestregelBase>[]>(
    () => [
      getCheckboxColumn(
        (row: Row<TestregelBase>) => `Velg ${row.original.namn}`,
        true
      ),
      {
        accessorFn: (row) => row.namn,
        id: 'Namn',
        cell: (info) => info.getValue(),
        header: () => <>Namn</>,
      },
      {
        accessorFn: (row) => row.krav.tittel,
        id: 'krav',
        cell: (info) => info.getValue(),
        header: () => <>Krav</>,
      },
      {
        accessorFn: (row) => row.type,
        id: 'type',
        cell: (info) => sanitizeEnumLabel(String(info.getValue())),
        header: () => <>Type</>,
      },
    ],
    []
  );

  const tableError = getErrorMessage(formMethods.formState, 'testregelList');

  const onChangeType = (selectedType: TestregelInnholdstype) => {
    const newType = type !== selectedType ? selectedType : undefined;
    setType(newType);
  };

  useEffect(() => {
    setSelectableTestreglar(filterList(testregelList, modus, type));
  }, [modus, type]);

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
          name="modus"
          options={typeOptions}
          label="Modus"
          description="Bestemmer om regelsettet for forenkla eller inngåande kontrollar"
          disabled={isDefined(regelsett?.modus)}
          required
        />
        <TestlabFormCheckbox
          label="Standard"
          description="Bestemmer om regelsettet skal komma opp som det standard regelsettet ein bruker i samband med å opprett saker"
          checkboxLabel="Standard regelsett"
          name="standard"
        />
        <div className="testregel-form-type-filter">
          <Heading level={3} size="xsmall" spacing>
            Filtrer type
          </Heading>
          <Chip.Group>
            <Chip.Toggle
              selected={type === 'nett'}
              onClick={() => onChangeType('nett')}
              checkmark={false}
            >
              Nett
            </Chip.Toggle>
            <Chip.Toggle
              selected={type === 'app'}
              onClick={() => onChangeType('app')}
              checkmark={false}
            >
              App
            </Chip.Toggle>
            <Chip.Toggle
              selected={type === 'automat'}
              onClick={() => onChangeType('automat')}
              checkmark={false}
            >
              Automat
            </Chip.Toggle>
            <Chip.Toggle
              selected={type === 'dokument'}
              onClick={() => onChangeType('dokument')}
              checkmark={false}
            >
              Dokument
            </Chip.Toggle>
          </Chip.Group>
        </div>
        <TestlabTable<TestregelBase>
          data={selectableTestreglar}
          defaultColumns={testRegelColumns}
          displayError={{ error: contextError }}
          loading={contextLoading}
          selectedRows={selectedRows}
          onSelectRows={onChangeRows}
          onClickRetry={refresh}
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
