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

import useValidate from '../../../common/form/hooks/useValidate';
import { TestlabFormButtonStep } from '../../../common/form/TestlabFormButtons';
import {
  HeaderCheckbox,
  RowCheckbox,
} from '../../../common/table/control/toggle/IndeterminateCheckbox';
import TestlabTable from '../../../common/table/TestlabTable';
import { Testregel, TestRegelsett } from '../../../testreglar/api/types';
import { SakFormBaseProps, SakFormState } from '../../types';
import SakStepFormWrapper from '../SakStepFormWrapper';

interface Props extends SakFormBaseProps {
  error: Error | undefined;
  loading: boolean;
  regelsettList: TestRegelsett[];
}

const SakTestreglarStep = ({
  regelsettList,
  onSubmit,
  maalingFormState,
  formStepState,
  error,
  loading,
}: Props) => {
  const formMethods = useForm<SakFormState>({
    defaultValues: maalingFormState,
  });

  const regelsettPrefix = 'regelsett';
  const { onClickBack } = formStepState;
  const [rowSelection, setRowSelection] = useState<Testregel[]>([]);
  const [testregelId, setTestregelId] = useState<string | undefined>(undefined);

  const { control, setValue, getValues, setError, clearErrors, formState } =
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
      label: tr.referanseAct,
      value: String(tr.id),
    }));

    regelsettList.forEach((rs) =>
      options.push({
        label: `Regelsett '${rs.namn}'`,
        value: `${regelsettPrefix}${String(rs.id)}`,
      })
    );

    return options;
  }, [selection]);

  const handleSelectRow = useCallback((selection: Testregel[]) => {
    setRowSelection(selection);
  }, []);

  const buttonStep: TestlabFormButtonStep = {
    stepType: 'Middle',
    onClickBack: onClickBack,
  };

  const testregelColumns = useMemo<ColumnDef<Testregel>[]>(
    () => [
      {
        id: 'Handling',
        header: ({ table }) => <HeaderCheckbox<Testregel> table={table} />,
        cell: ({ row }) => <RowCheckbox<Testregel> row={row} />,
        size: 1,
      },
      {
        accessorFn: (row) => row.referanseAct,
        id: 'TestregelId',
        cell: ({ row }) =>
          `${row.original.referanseAct} - ${row.original.kravTilSamsvar}`,
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

        useValidate<Testregel, SakFormState>({
          selection: values,
          name: 'testregelList',
          setError: setError,
          clearErrors: clearErrors,
          message: 'Testreglar må veljast',
        });

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

  const listErrors = formState.errors['testregelList'];

  const onSubmitTestreglar = (data: SakFormState) => {
    if (data.testregelList.length === 0) {
      setError('testregelList', {
        type: 'manual',
        message: 'Testreglar må veljast',
      });
    } else {
      onSubmit(data);
    }
  };

  return (
    <SakStepFormWrapper
      formStepState={formStepState}
      onSubmit={onSubmitTestreglar}
      formMethods={formMethods}
      buttonStep={buttonStep}
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
          <Button
            title="Legg til"
            color={ButtonColor.Success}
            onClick={onClickAdd}
          >
            Legg til
          </Button>
        </div>
        <div className="sak-testreglar__table">
          <TestlabTable<Testregel>
            data={selection}
            defaultColumns={testregelColumns}
            displayError={{ error }}
            inputError={listErrors?.message}
            loading={loading}
            onSelectRows={handleSelectRow}
            customStyle={{ small: true }}
            rowActions={[
              {
                action: 'delete',
                modalProps: {
                  title: 'Fjern rad',
                  disabled: rowSelection.length === 0,
                  message: 'Fjern valg?',
                  onConfirm: onClickRemove,
                },
              },
            ]}
          />
          {listErrors && <ErrorMessage>{listErrors?.message}</ErrorMessage>}
        </div>
      </div>
    </SakStepFormWrapper>
  );
};

export default SakTestreglarStep;
