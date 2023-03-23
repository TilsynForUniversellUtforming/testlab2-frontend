import { ErrorMessage, List, ListItem } from '@digdir/design-system-react';
import { ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import useValidate from '../../../common/form/hooks/useValidate';
import { TestlabFormButtonStep } from '../../../common/form/TestlabFormButtons';
import {
  HeaderCheckbox,
  RowCheckbox,
} from '../../../common/table/control/toggle/IndeterminateCheckbox';
import TestlabTable from '../../../common/table/TestlabTable';
import { Loeysing } from '../../../loeysingar/api/types';
import { SakFormBaseProps, SakFormState } from '../../types';
import SakFormContainer from '../SakFormContainer';

interface Props extends SakFormBaseProps {
  error: any;
  loading: boolean;
  onSubmit: (maalingFormState: SakFormState) => void;
  loeysingList: Loeysing[];
  onClickBack: () => void;
}

const SakLoeysingStep = ({
  heading,
  subHeading,
  onClickBack,
  error,
  loading,
  onSubmit,
  maalingFormState,
  loeysingList,
}: Props) => {
  const formMethods = useForm<SakFormState>({
    defaultValues: maalingFormState,
  });

  const { control, setValue, setError, clearErrors, formState } = formMethods;

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

  const listErrors = formState.errors['loeysingList'];

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
    <SakFormContainer
      heading={heading}
      subHeading={subHeading}
      formMethods={formMethods}
      onSubmit={onSubmit}
      buttonStep={buttonStep}
    >
      <div className="sak-loeysing__table">
        <TestlabTable<Loeysing>
          data={loeysingList}
          defaultColumns={loeysingColumns}
          fetchError={error}
          inputError={listErrors?.message}
          loading={loading}
          selectedRows={selectedRows}
          onSelectRows={onChangeRows}
          customStyle={{ small: true }}
        />
        {listErrors && <ErrorMessage>{listErrors?.message}</ErrorMessage>}
      </div>
      <div className="sak-loeysing__selection">
        <h4>Valgte løysingar</h4>
        {selection.length > 0 && (
          <List>
            {selection.length > 0 &&
              selection.map((tr) => (
                <ListItem key={tr.id}>
                  <div className="item">{tr.url}</div>
                </ListItem>
              ))}
          </List>
        )}
        {selection.length === 0 && <div>Ingen løysingar valgt</div>}
      </div>
    </SakFormContainer>
  );
};

export default SakLoeysingStep;
