import { ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import useValidate from '../../../../common/form/hooks/useValidate';
import TestlabForm from '../../../../common/form/TestlabForm';
import { TestlabFormButtonStep } from '../../../../common/form/TestlabFormButtons';
import {
  HeaderCheckbox,
  RowCheckbox,
} from '../../../../common/table/control/toggle/IndeterminateCheckbox';
import { Loeysing } from '../../../../loeysingar/api/types';
import { SakFormBaseProps, SakFormState } from '../../../types';
import Stepper from '../../Stepper';
import SakLoeysingTable from './SakLoeysingTable';

interface Props extends SakFormBaseProps {
  error: any;
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

  const { control, setValue, setError, clearErrors, formState } = formMethods;
  const { onClickBack, currentStep } = formStepState;

  const onChangeRows = (rowSelection: Loeysing[]) => {
    setValue('loeysingList', rowSelection);
    useValidate<Loeysing, SakFormState>({
      selection: rowSelection,
      name: 'loeysingList',
      setError: setError,
      clearErrors: clearErrors,
      message: 'Løysingar må veljast',
    });
  };

  const selection = useWatch({
    control,
    name: 'loeysingList',
  });

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
        header: ({ table }) => <HeaderCheckbox table={table} />,
        cell: ({ row }) => <RowCheckbox row={row} />,
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

  return (
    <div className="sak">
      <TestlabForm<SakFormState>
        heading={currentStep.heading}
        subHeading={currentStep.subHeading}
        onSubmit={onSubmit}
        formMethods={formMethods}
      >
        <div className="sak__stepper">
          <Stepper formStepState={formStepState} />
        </div>
        <div className="sak__form">
          <div className="sak__container">
            <SakLoeysingTable
              loeysingList={loeysingList}
              loeysingColumns={loeysingColumns}
              error={error}
              loading={loading}
              formState={formState}
              selectedRows={selectedRows}
              onChangeRows={onChangeRows}
              selection={selection}
            />
          </div>
          <TestlabForm.FormButtons step={buttonStep} />
        </div>
      </TestlabForm>
    </div>
  );
};

export default SakLoeysingStep;
