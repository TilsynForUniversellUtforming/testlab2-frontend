import { getErrorMessage } from '@common/form/util';
import { getCheckboxColumn } from '@common/table/control/toggle/CheckboxColumn';
import TestlabTable from '@common/table/TestlabTable';
import { joinStringsToList } from '@common/util/stringutils';
import {
  Button,
  ErrorMessage,
  Select,
  SingleSelectOption,
} from '@digdir/design-system-react';
import { zodResolver } from '@hookform/resolvers/zod';
import SakFormWrapper from '@sak/form/SakFormWrapper';
import { sakTestreglarValidationSchemaForenklet } from '@sak/form/steps/testreglar/forenklet/sakTestreglarValidationSchemaForenklet';
import { SakFormBaseProps, SakFormState } from '@sak/types';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Testregel, TestRegelsett } from '@testreglar/api/types';
import React, { useCallback, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

interface Props extends SakFormBaseProps {
  error: Error | undefined;
  loading: boolean;
  regelsettList: TestRegelsett[];
}

const SakTestreglarStep = ({
  onSubmit,
  sakFormState,
  regelsettList,
  formStepState,
  error,
  loading,
}: Props) => {
  const formMethods = useForm<SakFormState>({
    defaultValues: sakFormState,
    resolver: zodResolver(sakTestreglarValidationSchemaForenklet),
  });

  const regelsettPrefix = 'regelsett';
  const [rowSelection, setRowSelection] = useState<Testregel[]>([]);
  const [testregelId, setTestregelId] = useState<string | undefined>(undefined);

  const { control, setValue, getValues, setError, formState, clearErrors } =
    formMethods;

  const selection = useWatch<SakFormState>({
    control,
    name: 'testregelList',
  }) as Testregel[];

  const testRegelOptions = useMemo(() => {
    const filteredRegelsettList = regelsettList
      .map((rs) => rs.testregelList)
      .flat(1)
      .filter((tr) => !selection.find((s) => s.id === tr.id));

    const options: SingleSelectOption[] = filteredRegelsettList.map((tr) => ({
      label: `${tr.testregelNoekkel} - ${tr.kravTilSamsvar}`,
      value: String(tr.id),
    }));

    regelsettList.forEach((rs) =>
      options.unshift({
        label: `Regelsett '${rs.namn}'`,
        value: `${regelsettPrefix}${String(rs.id)}`,
      })
    );

    return options;
  }, [selection]);

  const handleSelectRow = useCallback((selection: Testregel[]) => {
    setRowSelection(selection);
  }, []);

  const testregelColumns = useMemo<ColumnDef<Testregel>[]>(
    () => [
      getCheckboxColumn(
        (row: Row<Testregel>) =>
          `Velg ${row.original.testregelNoekkel} - ${row.original.kravTilSamsvar}`,
        true
      ),
      {
        accessorFn: (row) => row.testregelNoekkel,
        id: 'TestregelId',
        cell: ({ row }) =>
          `${row.original.testregelNoekkel} - ${row.original.kravTilSamsvar}`,
        header: () => <>Testregel</>,
      },
      {
        accessorFn: (row) => row.krav,
        id: 'Krav',
        cell: (info) => info.getValue(),
        header: () => <>Krav</>,
      },
    ],
    []
  );

  const onClickAdd = () => {
    clearErrors();

    if (testregelId) {
      const testregelList: Testregel[] = [];
      if (testregelId.includes(regelsettPrefix)) {
        const regelsettId = testregelId.replace(regelsettPrefix, '');
        const selectedTestregelList = regelsettList.find(
          (rs) => rs.id === Number(regelsettId)
        )?.testregelList;
        if (selectedTestregelList) {
          selectedTestregelList.forEach((tr) => testregelList.push(tr));
        }
      } else {
        const selectedTestregel = regelsettList
          .map((rs) => rs.testregelList)
          .flat(1)
          .find((tr) => tr.id === Number(testregelId));
        if (selectedTestregel) {
          testregelList.push(selectedTestregel);
        }
      }

      if (testregelList && testregelList.length > 0) {
        const values = getValues('testregelList');
        values.push(...testregelList);
        const filteredValues = values.filter(
          (value, idx, self) => self.findIndex((v) => v.id === value.id) === idx
        );
        setValue('testregelList', filteredValues);
        setTestregelId(undefined);
      } else {
        setError('testregelList', {
          type: 'manual',
          message: 'Testreglar må veljast',
        });
      }
    }
  };

  const onClickRemove = useCallback(() => {
    const oldValues = getValues('testregelList');
    const newValues = oldValues.filter(
      (ov) => !rowSelection.map((rs) => rs.id).includes(ov.id)
    );
    setValue('testregelList', newValues);
  }, [rowSelection, setValue]);

  const formError = getErrorMessage(formState, 'testregelList');

  return (
    <SakFormWrapper
      formStepState={formStepState}
      onSubmit={onSubmit}
      formMethods={formMethods}
    >
      <div className="sak-testreglar">
        <div className="sak-testreglar__input-wrapper">
          <div className="sak-testreglar__input-select">
            <label htmlFor="testregelId" className="testlab-form__input-label">
              Testregel eller testregelsett
              <div className="testlab-form__input-sub-label">
                Vel enkelt testregel eller samling av testreglar (testregelsett)
                du vil legge til.
              </div>
            </label>
            <Select
              inputId="testregelId"
              onChange={setTestregelId}
              options={testRegelOptions}
              value={testregelId}
            />
          </div>
          <Button title="Legg til" color="success" onClick={onClickAdd}>
            Legg til
          </Button>
        </div>
        {formError && <ErrorMessage>{formError}</ErrorMessage>}
        <TestlabTable<Testregel>
          data={selection}
          defaultColumns={testregelColumns}
          displayError={{ error }}
          loading={loading}
          onSelectRows={handleSelectRow}
          customStyle={{ small: true }}
          rowActions={[
            {
              action: 'delete',
              rowSelectionRequired: true,
              modalProps: {
                title: 'Fjern rad',
                disabled: rowSelection.length === 0,
                message: `Fjern ${joinStringsToList(
                  rowSelection.map((rs) => rs.testregelNoekkel)
                )}?`,
                onConfirm: onClickRemove,
              },
            },
          ]}
        />
      </div>
    </SakFormWrapper>
  );
};

export default SakTestreglarStep;
