import {
  Button,
  ButtonColor,
  ErrorMessage,
  Select,
  SingleSelectOption,
} from '@digdir/design-system-react';
import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import useValidate from '../../../../common/form/hooks/useValidate';
import { TestlabFormButtonStep } from '../../../../common/form/TestlabFormButtons';
import {
  HeaderCheckbox,
  RowCheckbox,
} from '../../../../common/table/control/toggle/IndeterminateCheckbox';
import TestlabTable from '../../../../common/table/TestlabTable';
import { Loeysing } from '../../../../loeysingar/api/types';
import {
  LoeysingVerksemd,
  SakFormBaseProps,
  SakFormState,
} from '../../../types';
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
  const { onClickBack } = formStepState;
  const [loeysingId, setLoeysingId] = useState<string | undefined>(undefined);
  const [verksemdId, setVerksemdId] = useState<string | undefined>(undefined);
  const [rowSelection, setRowSelection] = useState<LoeysingVerksemd[]>([]);
  const [selectedRows, setSelectedRows] = useState<boolean[]>([]);

  const handleSelectRow = (selection: LoeysingVerksemd[]) => {
    const values = getValues('loeysingList');
    const selectionIds = selection.map(
      (s) => `${s.loeysing.id}_${s.verksemd.id}`
    );

    const rowArray: boolean[] = [];
    values.forEach(
      (tr, idx) =>
        (rowArray[idx] = selectionIds.includes(
          `${tr.loeysing.id}_${tr.verksemd.id}`
        ))
    );

    setSelectedRows(rowArray);
    setRowSelection(selection);
  };

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

  const onClickAdd = () => {
    if (loeysingId && verksemdId) {
      const loeysing = loeysingList.find((l) => l.id === Number(loeysingId));
      const verksemd = loeysingList.find((l) => l.id === Number(verksemdId));
      if (loeysing && verksemd) {
        const oldValues = getValues('loeysingList');
        const newLoeysingList = [
          ...oldValues,
          { loeysing: loeysing, verksemd: verksemd },
        ];
        setValue('loeysingList', newLoeysingList);

        useValidate<LoeysingVerksemd, SakFormState>({
          selection: newLoeysingList,
          name: 'loeysingList',
          setError: setError,
          clearErrors: clearErrors,
          message: 'Løysing og verksemd må veljast',
        });

        setLoeysingId(undefined);
        setVerksemdId(undefined);
      } else {
        setError('loeysingList', {
          type: 'manual',
          message: 'Løysing og verksemd må veljast',
        });
      }
    }
  };

  const onClickRemove = useCallback(() => {
    const oldValues = getValues('loeysingList');
    const newLoeysingList = oldValues.filter(
      (_, index) => !selectedRows[index]
    );
    // setValue('loeysingList', newLoeysingList);
    const unselected = newLoeysingList.map(() => false);
    console.log('unselected i LOSY', unselected);
    setSelectedRows(unselected);
  }, []);

  const selection = useWatch<SakFormState>({
    control,
    name: 'loeysingList',
  }) as LoeysingVerksemd[];

  const loeysingColumns = useMemo<ColumnDef<LoeysingVerksemd>[]>(
    () => [
      {
        id: 'Handling',
        header: ({ table }) => (
          <HeaderCheckbox<LoeysingVerksemd> table={table} />
        ),
        cell: ({ row }) => <RowCheckbox<LoeysingVerksemd> row={row} />,
        size: 1,
      },
      {
        accessorFn: (row) => row.loeysing.url,
        id: 'url',
        cell: (info) => info.getValue(),
        header: () => <>Namn på løysing</>,
      },
      {
        accessorFn: (row) => row.verksemd.namn,
        id: 'namn',
        cell: (info) => info.getValue(),
        header: () => <span>Ansvarleg verksemd</span>,
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
        <div className="sak-loeysing__input-wrapper">
          <div className="sak-loeysing__input-select">
            <Select
              options={loeysingOptions}
              label="Loeysing"
              onChange={setLoeysingId}
            />
          </div>
          <div className="sak-loeysing__input-select">
            <Select
              options={verksemdOptions}
              label="Ansvarlig verksemd (i saka)"
              onChange={setVerksemdId}
            />
          </div>
          <Button
            title="Legg til"
            color={ButtonColor.Success}
            onClick={onClickAdd}
          >
            Legg til
          </Button>
        </div>
        <div className="sak-loeysing__table">
          <TestlabTable<LoeysingVerksemd>
            data={selection}
            defaultColumns={loeysingColumns}
            displayError={{ error }}
            inputError={listErrors?.message}
            loading={loading}
            selectedRows={selectedRows}
            onSelectRows={handleSelectRow}
            customStyle={{ small: true }}
            rowActions={[
              { action: 'delete', label: 'Slett rad', onClick: onClickRemove },
            ]}
          />
          {listErrors && <ErrorMessage>{listErrors?.message}</ErrorMessage>}
        </div>
      </div>
    </SakStepFormWrapper>
  );
};

export default SakLoeysingStep;
