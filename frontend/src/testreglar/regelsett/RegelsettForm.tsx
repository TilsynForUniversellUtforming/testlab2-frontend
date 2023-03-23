import { ColumnDef } from '@tanstack/react-table';
import classNames from 'classnames';
import React, { useCallback, useMemo } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { useOutletContext } from 'react-router-dom';

import useValidate, {
  testreglarMessage,
} from '../../common/form/hooks/useValidate';
import TestlabForm from '../../common/form/TestlabForm';
import StatusBadge from '../../common/status-badge/StatusBadge';
import {
  HeaderCheckbox,
  RowCheckbox,
} from '../../common/table/control/toggle/IndeterminateCheckbox';
import TestlabTable from '../../common/table/TestlabTable';
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

  const { control, setValue, setError, clearErrors } = formMethods;

  const onChangeRows = useCallback((rowSelection: Testregel[]) => {
    setValue('testregelList', rowSelection);
    useValidate<Testregel, TestRegelsett>({
      selection: rowSelection,
      name: 'testregelList',
      setError: setError,
      clearErrors: clearErrors,
      message: testreglarMessage,
    });
  }, []);

  const selection = useWatch({
    control,
    name: 'testregelList',
    defaultValue: regelsett?.testregelList ?? [],
  });

  const listErrors = formState.errors['testregelList'];

  const selectableTestreglar = testreglar.filter((tr) => tr.referanseAct);

  const selectedRows = useMemo(() => {
    const rowArray: boolean[] = [];
    regelsett?.testregelList.forEach((tr) => (rowArray[tr.id - 1] = true));
    return rowArray;
  }, []);

  const testRegelColumns = useMemo<ColumnDef<Testregel>[]>(
    () => [
      {
        id: 'Handling',
        header: ({ table }) => <HeaderCheckbox table={table} />,
        cell: ({ row }) => <RowCheckbox row={row} />,
        size: 1,
      },
      {
        accessorFn: (row) => row.kravTilSamsvar,
        id: 'Navn',
        cell: (info) => info.getValue(),
        header: () => <span>Navn</span>,
      },
      {
        accessorFn: (row) => row.status,
        id: 'Status',
        cell: (info) => (
          <StatusBadge
            label={info.getValue()}
            levels={{
              primary: 'Publisert',
              danger: 'Utgår',
              success: 'Klar for testing',
            }}
          />
        ),
        header: () => <span>Status</span>,
      },
      {
        accessorFn: (row) => row.type,
        id: 'Type',
        cell: (info) => info.getValue(),
        header: () => <span>Type</span>,
      },
      {
        accessorFn: (row) => row.referanseAct,
        id: 'TestregelId',
        cell: (info) => info.getValue(),
        header: () => <span>Testregel</span>,
      },
      {
        accessorFn: (row) => row.kravTittel,
        id: 'Krav',
        cell: (info) => info.getValue(),
        header: () => <span>Krav</span>,
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
              <TestlabForm.FormInput
                label="Navn"
                name="namn"
                formValidation={{
                  errorMessage: 'Navn kan ikke være tomt',
                  validation: { required: true, minLength: 1 },
                }}
              />
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
                fetchError={contextError}
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
