import { ErrorMessage, List, ListItem } from '@digdir/design-system-react';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { FormState } from 'react-hook-form';

import TestlabTable from '../../../../common/table/TestlabTable';
import { Loeysing } from '../../../../loeysingar/api/types';
import { SakFormState } from '../../../types';

export interface Props {
  loeysingList: Loeysing[];
  loeysingColumns: ColumnDef<Loeysing>[];
  error: Error | undefined;
  loading: boolean;
  formState: FormState<SakFormState>;
  selectedRows: boolean[];
  onChangeRows: (rowSelection: Loeysing[]) => void;
  selection: Loeysing[];
}

const SakLoeysingTable = ({
  loeysingList,
  loeysingColumns,
  error,
  loading,
  formState,
  selectedRows,
  onChangeRows,
  selection,
}: Props) => {
  const listErrors = formState.errors['loeysingList'];

  return (
    <>
      <div className="sak-loeysing__table">
        <TestlabTable<Loeysing>
          data={loeysingList}
          defaultColumns={loeysingColumns}
          displayError={{ error }}
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
    </>
  );
};

export default SakLoeysingTable;
