import TestlabForm from '@common/form/TestlabForm';
import {
  HeaderCheckbox,
  RowCheckbox,
} from '@common/table/control/toggle/IndeterminateCheckbox';
import TestlabTable from '@common/table/TestlabTable';
import { CellCheckboxId } from '@common/table/types';
import { ColumnDef } from '@tanstack/react-table';
import classNames from 'classnames';
import React, { useCallback, useMemo } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { useOutletContext } from 'react-router-dom';

import { Testregel, TestRegelsett } from '../api/types';
import { TestregelContext } from '../types';

export interface Props {
  label: string;
  regelsett?: TestRegelsett;
  formMethods: UseFormReturn<TestRegelsett>;
  onSubmit: (testregel: TestRegelsett) => void;
}

const RegelsettForm = ({ label, regelsett, formMethods, onSubmit }: Props) => {
  const { formState } = formMethods;
  const {
    contextError,
    contextLoading,
    testreglar,
    refresh,
  }: TestregelContext = useOutletContext();

  const { control, setValue } = formMethods;

  const onChangeRows = useCallback((rowSelection: Testregel[]) => {
    setValue('testregelList', rowSelection);
  }, []);

  const selection = useWatch({
    control,
    name: 'testregelList',
    defaultValue: regelsett?.testregelList ?? [],
  });

  const listErrors = formState.errors['testregelList'];

  const selectableTestreglar = testreglar.filter((tr) => tr.testregelNoekkel);

  const selectedRows = useMemo(() => {
    const rowArray: boolean[] = [];
    regelsett?.testregelList.forEach((tr) => (rowArray[tr.id - 1] = true));
    return rowArray;
  }, []);

  const testRegelColumns = useMemo<ColumnDef<Testregel>[]>(
    () => [
      {
        id: CellCheckboxId,
        header: ({ table }) => <HeaderCheckbox table={table} />,
        cell: ({ row }) => (
          <RowCheckbox
            row={row}
            ariaLabel={`Velg ${row.original.testregelNoekkel} - ${row.original.kravTilSamsvar}`}
          />
        ),
        size: 1,
      },
      {
        accessorFn: (row) => row.kravTilSamsvar,
        id: 'Namn',
        cell: (info) => info.getValue(),
        header: () => <span>Namn</span>,
      },
      {
        accessorFn: (row) => row.testregelNoekkel,
        id: 'TestregelId',
        cell: (info) => info.getValue(),
        header: () => <span>Testregel</span>,
      },
    ],
    []
  );

  return (
    <>
      <TestlabForm<TestRegelsett>
        heading={label}
        onSubmit={onSubmit}
        formMethods={formMethods}
      >
        <div>
          <div>
            <div className="mb-3">
              <TestlabForm.FormInput label="Namn" name="namn" />
              <span>Valgte regelsett</span>
              <ol
                className="testreglar-regelsett__list"
                // numbered={selection.length > 0}
              >
                {selection.length > 0 &&
                  selection.map((tr) => (
                    <li key={tr.id}>{tr.kravTilSamsvar}</li>
                  ))}
                {selection.length === 0 && (
                  <li
                    className={classNames({ invalid: listErrors })}
                    // disabled
                  >
                    Ingen testregler valgt
                  </li>
                )}
              </ol>
              {listErrors && (
                <div className="invalid-feedback d-block">
                  {listErrors?.message}
                </div>
              )}
            </div>
          </div>
          <div>
            <div>
              <TestlabTable<Testregel>
                data={selectableTestreglar}
                defaultColumns={testRegelColumns}
                displayError={{ error: contextError }}
                loading={contextLoading}
                selectedRows={selectedRows}
                onSelectRows={onChangeRows}
                onClickRetry={refresh}
                customStyle={{ small: true }}
              />
            </div>
          </div>
        </div>
        <div>
          <TestlabForm.FormButtons />
        </div>
      </TestlabForm>
    </>
  );
};

export default RegelsettForm;
