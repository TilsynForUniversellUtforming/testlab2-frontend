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
    <DebouncedInput
      value={(columnFilterValue ?? '') as string}
      onChange={(value) => column.setFilterValue(value)}
    />
  );
};

export default TableFilterInput;
