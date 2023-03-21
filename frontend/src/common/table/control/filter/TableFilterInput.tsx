import { Column, Row } from '@tanstack/react-table';
import React from 'react';

import DebouncedInput from '../../../DebouncedInput';

export interface Props<T extends object> {
  headerRow?: Row<T>;
  column: Column<T>;
}

const TableFilterInput = <T extends object>({
  headerRow,
  column,
}: Props<T>) => {
  if (!column.getCanFilter()) {
    return null;
  }

  const firstValue = headerRow?.getValue(column.id);
  const columnFilterValue = column.getFilterValue();

  if (typeof firstValue === 'number') {
    return (
      <>
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0]
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ''
          }`}
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ''
          }`}
        />
      </>
    );
  }

  return (
    <DebouncedInput
      type="text"
      placeholder=""
      value={(columnFilterValue ?? '') as string}
      onChange={(value) => column.setFilterValue(value)}
      list={column.id + 'list'}
      onClick={(e) => e.preventDefault()}
    />
  );
};

export default TableFilterInput;
