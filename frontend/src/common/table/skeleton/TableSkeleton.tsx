import 'react-loading-skeleton/dist/skeleton.css';

import {
  Checkbox,
  LegacyTableCell,
  LegacyTableRow,
} from '@digdir/design-system-react';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { CellCheckboxId, TableProps } from '../types';

const TableSkeleton = <T extends object>({ table }: TableProps<T>) => (
  <>
    {[...Array(10)].map((_, i) => (
      <LegacyTableRow key={`skeleton_row_${i}`} className="table-skeleton-row">
        {table.getAllColumns().map((col, i) => {
          const isCheckbox = col.id === CellCheckboxId;

          return (
            <LegacyTableCell key={`skeleton_col_${i}`}>
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
            </LegacyTableCell>
          );
        })}
      </LegacyTableRow>
    ))}
  </>
);

export default TableSkeleton;
