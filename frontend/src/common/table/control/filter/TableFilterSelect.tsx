import { headingWithoutSorting } from '@common/table/util';
import { Option } from '@common/types';
import { sanitizeEnumLabel } from '@common/util/stringutils';
import { Select, SortDirection, TableCell } from '@digdir/design-system-react';
import { flexRender, Header, Table } from '@tanstack/react-table';
import React, { useMemo } from 'react';

export interface Props<T extends object> {
  table: Table<T>;
  header: Header<T, unknown>;
  sortDirection: SortDirection;
}

const TableFilterSelect = <T extends object>({
  table,
  header,
  sortDirection,
}: Props<T>) => {
  const column = header.column;

  const columnFilterValue = column.getFilterValue();

  const search = (value: string) => {
    table.setPageIndex(0);
    column.setFilterValue(value);
  };

  const options = useMemo(() => {
    const defaultOption: Option = {
      label: 'Alle',
      value: '',
    };

    const keysWithoutSortingNumbers = [
      ...new Set(
        Array.from(column.getFacetedUniqueValues().keys()).map((key) =>
          headingWithoutSorting(String(key))
        )
      ),
    ];
    const computedOptions: Option[] = keysWithoutSortingNumbers
      .map((value) => ({
        label: sanitizeEnumLabel(value),
        value: value,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
    computedOptions.unshift(defaultOption);

    return computedOptions;
  }, [column]);

  return (
    <TableCell className="testlab-table__column-filter">
      <button
        className="testlab-table__column-filter-sort"
        onClick={column.getToggleSortingHandler()}
      >
        {flexRender(column.columnDef.header, header.getContext())}
        <svg
          width="10"
          height="5"
          viewBox="0 0 10 5"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Sortering"
          data-testid="sort-icon"
          style={{
            transform:
              sortDirection === 'desc'
                ? 'rotate(0deg)'
                : sortDirection === 'asc'
                  ? 'rotate(180deg)'
                  : 'none',
          }}
        >
          <path
            d="M9.30758 0.229492H1.12508H0.333221L4.8204 4.89616L9.30758 0.229492Z"
            fill="black"
          ></path>
        </svg>
      </button>
      <div className="testlab-table__column-filter-select">
        <Select
          value={(columnFilterValue ?? '') as string}
          onChange={(value) => search(value)}
          options={options}
          label={`Velg ${column.id}`}
          hideLabel
        />
      </div>
    </TableCell>
  );
};

export default TableFilterSelect;
