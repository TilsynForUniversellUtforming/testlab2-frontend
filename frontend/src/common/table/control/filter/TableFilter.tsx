import { TableCell } from '@digdir/design-system-react';
import { Column, Row } from '@tanstack/react-table';
import React from 'react';

import { FilterPreference } from '../../TestlabTable';
import TableFilterInput from './TableFilterInput';

export interface Props<T> {
  headerRow?: Row<T>;
  column: Column<T>;
  filterPreference: FilterPreference;
}

const TableFilter = <T extends object>({
  headerRow,
  column,
  filterPreference,
}: Props<T>) => {
  const showFilters =
    filterPreference !== 'none' && filterPreference !== 'searchbar';

  if (!showFilters) {
    return null;
  }

  return (
    <TableCell>
      <TableFilterInput column={column} headerRow={headerRow} />
    </TableCell>
  );
};

export default TableFilter;
