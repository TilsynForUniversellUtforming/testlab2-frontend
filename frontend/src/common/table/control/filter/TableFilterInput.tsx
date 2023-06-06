import { Select } from '@digdir/design-system-react';
import { Column } from '@tanstack/react-table';
import React from 'react';

import DebouncedInput from '../../../DebouncedInput';
import { Option } from '../../../types';
import { sanitizeLabel } from '../../../util/stringutils';

export interface Props<T extends object> {
  column: Column<T>;
}

const TableFilterInput = <T extends object>({ column }: Props<T>) => {
  if (!column.getCanFilter()) {
    return null;
  }

  const columnFilterValue = column.getFilterValue();

  if (column.columnDef?.meta?.select) {
    const defaultOption: Option = {
      label: 'Alle',
      value: '',
    };
    const options: Option[] = Array.from(
      column.getFacetedUniqueValues().keys()
    ).map((value) => ({
      label: sanitizeLabel(value),
      value: value,
    }));
    options.unshift(defaultOption);

    return (
      <div className="testlab-table__column-filter">
        <Select
          value={(columnFilterValue ?? '') as string}
          onChange={(value) => column.setFilterValue(value)}
          options={options}
        />
      </div>
    );
  }

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
