import { flexRender, Header, Table } from '@tanstack/react-table';
import classNames from 'classnames';
import React from 'react';
import { Button, Stack } from 'react-bootstrap';

import TableFilter from './control/filter/TableFilter';

export interface Props {
  table: Table<any>;
  header: Header<any, unknown>;
  showFilters: boolean;
}

const TableHeader = ({ table, header, showFilters }: Props) => {
  if (header.isPlaceholder) {
    return null;
  }

  return (
    <th colSpan={header.colSpan}>
      <Button
        className="digdir-table__header-button p-0 w-100"
        variant="link"
        onClick={header.column.getToggleSortingHandler()}
      >
        <Stack direction="horizontal" gap={2}>
          {flexRender(header.column.columnDef.header, header.getContext())}
          <i
            className={classNames(
              'sortering ms-auto',
              { 'sort-asc': header.column?.getIsSorted() === 'asc' },
              { 'sort-desc': header.column?.getIsSorted() === 'desc' }
            )}
          />
        </Stack>
      </Button>
      {header.column.getCanFilter() && showFilters ? (
        <div>
          <TableFilter column={header.column} table={table} />
        </div>
      ) : null}
    </th>
  );
};

export default TableHeader;
