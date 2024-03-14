import 'react-loading-skeleton/dist/skeleton.css';

import { Checkbox, Table } from '@digdir/design-system-react';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { CellCheckboxId, TableProps } from '../types';

const TableSkeleton = <T extends object>({ table }: TableProps<T>) => (
  <>
    {[...Array(10)].map((_, i) => (
      <Table.Row key={`skeleton_row_${i}`} className="table-skeleton-row">
        {table.getAllColumns().map((col, i) => {
          const isCheckbox = col.id === CellCheckboxId;

          return (
            <Table.Cell key={`skeleton_col_${i}`}>
              {isCheckbox ? (
                <Checkbox
                  size="small"
                  title="laster..."
                  disabled={true}
                  value=""
                />
              ) : (
                <Skeleton />
              )}
            </Table.Cell>
          );
        })}
      </Table.Row>
    ))}
  </>
);

export default TableSkeleton;
