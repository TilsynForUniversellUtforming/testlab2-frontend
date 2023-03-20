import { flexRender, Header, Table } from '@tanstack/react-table';
import classNames from 'classnames';
import React from 'react';

import TableFilter from './control/filter/TableFilter';
import { FilterPreference } from './TestlabTable';

export interface Props {
  table: Table<any>;
  header: Header<any, unknown>;
  filterPreference: FilterPreference;
  loading: boolean;
}

const TableHeader = ({ table, header, filterPreference, loading }: Props) => {
  if (header.isPlaceholder) {
    return null;
  }

  if (!header.column.getCanSort()) {
    const size: number | undefined = header.column.columnDef.size;
    const width = size ? `${3 * size}rem` : 'auto';

    return (
      <th colSpan={header.colSpan} style={{ width: width }}>
        {flexRender(header.column.columnDef.header, header.getContext())}
      </th>
    );
  }

  const showFilters =
    filterPreference !== 'none' && filterPreference !== 'searchbar';

  return (
    <th colSpan={header.colSpan}>
      {/*variant="link"*/}
      <button
        className="testlab-table__header-button p-0 w-100"
        onClick={header.column.getToggleSortingHandler()}
        disabled={loading}
      >
        <div>
          {flexRender(header.column.columnDef.header, header.getContext())}
          <i
            className={classNames(
              'sortering ms-auto',
              { 'sort-asc': header.column?.getIsSorted() === 'asc' },
              { 'sort-desc': header.column?.getIsSorted() === 'desc' }
            )}
          />
        </div>
      </button>
      {header.column.getCanFilter() && showFilters ? (
        <div>
          <TableFilter column={header.column} table={table} />
        </div>
      ) : null}
    </th>
  );
};

export default TableHeader;
