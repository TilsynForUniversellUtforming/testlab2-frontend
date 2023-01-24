import './digdirTable.scss';
import 'react-loading-skeleton/dist/skeleton.css';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';

import HideWhenLoading from '../HideWhenLoading';
import PageSizeSelection from './control/pagination/PageSizeSelection';
import PaginationContainer from './control/pagination/PaginationContainer';
import TableError from './error/TableError';
import TableBody from './TableBody';

interface Props {
  data: any[];
  defaultColumns: ColumnDef<any>[];
  error: any;
  loading: boolean;
  onClickRetry: () => void;
}

const DigdirTable = ({
  data,
  defaultColumns,
  error,
  loading,
  onClickRetry,
}: Props) => {
  const [columns] = useState<typeof defaultColumns>(() => [...defaultColumns]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const [state, setState] = useState(table.initialState);

  table.setOptions((prev) => ({
    ...prev,
    state,
    onStateChange: setState,
  }));

  if (error) {
    return <TableError show={error} onClickRetry={onClickRetry} />;
  }

  return (
    <div className="p-2 digdir-table">
      <PageSizeSelection table={table} loading={loading} />
      <Table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          <TableBody table={table} loading={loading} />
        </tbody>
      </Table>
      <div className="h-2" />
      <HideWhenLoading loading={loading}>
        <PaginationContainer table={table} />
      </HideWhenLoading>
    </div>
  );
};

export default DigdirTable;
