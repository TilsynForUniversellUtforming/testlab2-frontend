import {
  Checkbox,
  ResponsiveTableConfig,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@digdir/design-system-react';
import React from 'react';

interface Props<T extends object> extends ResponsiveTableConfig<T> {
  error?: any;
  loading?: boolean;
  sortableColumns: (keyof T)[];
  onSort?: () => void;
  currentlySortedColumn?: keyof T | undefined;
  selectedRows?: boolean[];
  onSelectRows?: (rows: T[]) => void; // Funksjon for row selection, implisitt selectable row
  onClickRetry?: () => void;
}

const TestlabResponsiveTable = <T extends object>({
  rows,
  headers,
  renderCell,
  columnSort,
  rowSelection,
  footer,
  sortableColumns,
  onSort,
  currentlySortedColumn,
}: Props<T>) => {
  const selectedRowJson = JSON.stringify(rowSelection?.selectedValue || null);
  const columns = Object.keys(headers) as (keyof T)[];
  const numColumns = rowSelection
    ? Object.keys(headers).length + 1
    : Object.keys(headers).length;

  return (
    <Table
      selectRows={!!rowSelection}
      onChange={({ selectedValue }) =>
        rowSelection?.onSelectionChange(selectedValue)
      }
      selectedValue={rowSelection?.selectedValue}
    >
      <TableHeader>
        <TableRow>
          {rowSelection && <TableCell radiobutton={true}></TableCell>}
          {columns.map((column) => (
            <TableCell
              key={column as string}
              onChange={({ next, previous }) => {
                columnSort &&
                  columnSort.onSortChange({ column, next, previous });
              }}
              sortDirection={
                columnSort
                  ? columnSort.currentlySortedColumn === column
                    ? columnSort.currentDirection
                    : columnSort.sortable.includes(column)
                    ? 'notActive'
                    : 'notSortable'
                  : 'notSortable'
              }
            >
              {headers[column]}
            </TableCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => {
          const value = JSON.stringify(row);
          return (
            <TableRow key={value} rowData={row}>
              {rowSelection && (
                <TableCell radiobutton={true}>
                  <Checkbox
                    name={value}
                    onChange={() => rowSelection.onSelectionChange(row)}
                    checked={value === selectedRowJson}
                    label={value}
                    hideLabel={true}
                  ></Checkbox>
                </TableCell>
              )}
              {columns.map((column) => {
                const renderFunc = renderCell && renderCell[column];
                return (
                  <TableCell key={`${value}-${column as string}`}>
                    {renderFunc
                      ? renderFunc(row[column])
                      : (row[column] as string)}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default TestlabResponsiveTable;
