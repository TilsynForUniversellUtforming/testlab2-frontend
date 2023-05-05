import {
  Button,
  ButtonColor,
  ErrorMessage,
  Select,
  SingleSelectOption,
} from '@digdir/design-system-react';
import { ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import useValidate from '../../../../common/form/hooks/useValidate';
import { TestlabFormButtonStep } from '../../../../common/form/TestlabFormButtons';
import {
  HeaderCheckbox,
  RowCheckbox,
} from '../../../../common/table/control/toggle/IndeterminateCheckbox';
import TestlabTable from '../../../../common/table/TestlabTable';
import { Loeysing } from '../../../../loeysingar/api/types';
import { SakFormBaseProps, SakFormState } from '../../../types';
import SakStepFormWrapper from '../../SakStepFormWrapper';

interface Props extends SakFormBaseProps {
  error: Error | undefined;
  loading: boolean;
  loeysingList: Loeysing[];
}

const SakLoeysingStep = ({
  formStepState,
  maalingFormState,
  error,
  loading,
  onSubmit,
  loeysingList,
}: Props) => {
  const formMethods = useForm<SakFormState>({
    defaultValues: maalingFormState,
  });

  const { control, setValue, getValues, setError, clearErrors, formState } =
    formMethods;
  const { onClickBack, currentStep } = formStepState;

  const loeysingOptions: SingleSelectOption[] = useMemo(
    () =>
      loeysingList.map((l) => ({
        label: l.namn,
        formattedLabel: (
          <>
            <b>{l.namn}</b>
            <div>{l.url}</div>
          </>
        ),
        value: String(l.id),
      })),
    []
  );

  const verksemdOptions: SingleSelectOption[] = loeysingList.map((l) => ({
    label: l.namn,
    value: String(l.id),
  }));

  const onSelectLoeysing = (rowSelection: Loeysing[]) => {
    setValue('loeysingList', rowSelection);
    useValidate<Loeysing, SakFormState>({
      selection: rowSelection,
      name: 'loeysingList',
      setError: setError,
      clearErrors: clearErrors,
      message: 'Løysingar må veljast',
    });
  };

  const selection = useWatch<SakFormState>({
    control,
    name: 'loeysingList',
  }) as Loeysing[];

  const selectedRows = useMemo(() => {
    const rowArray: boolean[] = [];
    maalingFormState?.loeysingList.forEach(
      (tr) => (rowArray[tr.id - 1] = true)
    );
    return rowArray;
  }, [maalingFormState]);

  const loeysingColumns = useMemo<ColumnDef<Loeysing>[]>(
    () => [
      {
        id: 'Handling',
        header: ({ table }) => <HeaderCheckbox<Loeysing> table={table} />,
        cell: ({ row }) => <RowCheckbox<Loeysing> row={row} />,
        size: 1,
      },
      {
        accessorFn: (row) => row.namn,
        id: 'Navn',
        cell: (info) => info.getValue(),
        header: () => <span>Navn</span>,
      },
      {
        accessorFn: (row) => row.url,
        id: 'url',
        cell: (info) => info.getValue(),
        header: () => <span>URL</span>,
      },
    ],
    []
  );

  const buttonStep: TestlabFormButtonStep = {
    stepType: 'Middle',
    onClickBack: onClickBack,
  };

  const listErrors = formState.errors['loeysingList'];

  return (
    <SakStepFormWrapper
      formStepState={formStepState}
      onSubmit={onSubmit}
      formMethods={formMethods}
      buttonStep={buttonStep}
    >
      <div className="sak-loeysing">
        <div className="sak-loeysing__input-buttons">
          <Select options={loeysingOptions} label="Loeysing" />
          <Select options={verksemdOptions} label="Verksemd" />
          <Button title="Legg til" color={ButtonColor.Success}>
            Legg til
          </Button>
        </div>
        <div className="sak-loeysing__table">
          <TestlabTable<Loeysing>
            data={selection}
            defaultColumns={loeysingColumns}
            displayError={{ error }}
            inputError={listErrors?.message}
            loading={loading}
            selectedRows={selectedRows}
            // onSelectRows={onChangeRows}
            customStyle={{ small: true }}
          />
          {listErrors && <ErrorMessage>{listErrors?.message}</ErrorMessage>}
        </div>
      </div>
    </SakStepFormWrapper>
  );
};

export default SakLoeysingStep;
