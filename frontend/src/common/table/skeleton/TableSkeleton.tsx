import 'react-loading-skeleton/dist/skeleton.css';

import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { TableProps } from '../types';

const TableSkeleton = <T extends object>({ table }: TableProps<T>) => {
  const tableLength = table.getAllColumns().length;

  return (
    <>
      {[...Array(10)].map((_, i) => (
        <tr key={`skeleton_row_${i}`}>
          {[...Array(tableLength)].map((_, i) => (
            <td className="table-skeleton" key={`skeleton_col_${i}`}>
              <Skeleton />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default TableSkeleton;
