import DebouncedInput from '@common/debounced-input/DebouncedInput';
import { Option } from '@common/types';
import { sanitizeLabel } from '@common/util/stringutils';
import { Select } from '@digdir/design-system-react';
import { Column, Table } from '@tanstack/react-table';
import React from 'react';

export interface Props<T extends object> {
  table: Table<T>;
  column: Column<T>;
}

const TableFilterInput = <T extends object>({ table, column }: Props<T>) => {
  if (!column.getCanFilter()) {
    return null;
  }

  const columnFilterValue = column.getFilterValue();

  const search = (value: string) => {
    table.setPageIndex(0);
    column.setFilterValue(value);
  };

  if (column.columnDef?.meta?.select) {
    const defaultOption: Option = {
      label: 'Alle',
      value: '',
    };
    const options: Option[] = Array.from(column.getFacetedUniqueValues().keys())
      .map((value) => ({
        label: sanitizeLabel(value),
        value: value,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
    options.unshift(defaultOption);

    return (
      <div className="testlab-table__column-filter">
        <Select
          value={(columnFilterValue ?? '') as string}
          onChange={(value) => search(value)}
          options={options}
        />
      </div>
    );
  }

  return (
    <div className="testlab-table__column-filter">
      <DebouncedInput
        value={(columnFilterValue ?? '') as string}
        onChange={(value) => search(String(value))}
        ariaLabel={column.columnDef?.id ?? ''}
        id={column.columnDef?.id ?? ''}
      />
    </div>
  );
};

export default TableFilterInput;
