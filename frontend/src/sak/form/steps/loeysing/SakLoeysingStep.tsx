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

  const handleSelectRow = useCallback((selection: LoeysingVerksemd[]) => {
    setRowSelection(selection);
  }, []);

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
        const filteredValues = newLoeysingList.filter(
          (value, idx, self) =>
            self.findIndex((v) => v.loeysing.id === value.loeysing.id) === idx
        );
        if (filteredValues.length !== newLoeysingList.length) {
          setError('loeysingList', {
            type: 'manual',
            message: 'Løysingar må vera unike',
          });
        } else {
          setValue('loeysingList', filteredValues);

          useValidate<LoeysingVerksemd, SakFormState>({
            selection: newLoeysingList,
            name: 'loeysingList',
            setError: setError,
            clearErrors: clearErrors,
            message: 'Løysing og verksemd må veljast',
          });
        }

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
      (ov) =>
        !rowSelection
          .map((rs) => `${rs.loeysing.id}_${rs.verksemd.id}`)
          .includes(`${ov.loeysing.id}_${ov.verksemd.id}`)
    );
    setValue('loeysingList', newLoeysingList);
  }, [rowSelection, setValue]);

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

  const onSubmitLoeysing = (data: SakFormState) => {
    if (data.loeysingList.length === 0) {
      setError('loeysingList', {
        type: 'manual',
        message: 'Løysing og verksemd må veljast',
      });
    } else {
      onSubmit(data);
    }
  };

  return (
    <SakStepFormWrapper
      formStepState={formStepState}
      onSubmit={onSubmitLoeysing}
      formMethods={formMethods}
      buttonStep={buttonStep}
    >
      <div className="sak-loeysing">
        <div className="sak-loeysing__input-wrapper">
          <div className="sak-loeysing__input-select">
            <Select
              options={loeysingOptions}
              label="Løysing"
              onChange={setLoeysingId}
              value={loeysingId}
            />
          </div>
          <div className="sak-loeysing__input-select">
            <Select
              options={verksemdOptions}
              label="Ansvarlig verksemd (i saka)"
              onChange={setVerksemdId}
              value={verksemdId}
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
