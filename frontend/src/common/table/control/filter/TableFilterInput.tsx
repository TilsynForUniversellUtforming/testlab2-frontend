import { Column } from '@tanstack/react-table';
import React from 'react';

import DebouncedInput from '../../../DebouncedInput';

export interface Props<T extends object> {
  column: Column<T>;
}

const TableFilterInput = <T extends object>({ column }: Props<T>) => {
  if (!column.getCanFilter()) {
    return null;
  }

  const columnFilterValue = column.getFilterValue();

  return (
    <div className="testlab-table__column-filter">
      <DebouncedInput
        value={(columnFilterValue ?? '') as string}
        onChange={(value) => column.setFilterValue(value)}
        ariaLabel={column.columnDef?.id ?? ''}
      />
    </div>
  );
};

export default TableFilterInput;
