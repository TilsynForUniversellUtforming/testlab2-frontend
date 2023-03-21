import React from 'react';

import { TableProps } from '../../types';

const PaginationCount = ({ table }: TableProps) => {
  const numRows = table.getCoreRowModel().rows.length;
  const currentRows = table.getRowModel().rows.length;
  const filteredRows = table.getFilteredRowModel().rows.length;

  if (numRows === 0) {
    return <>Ingen element</>;
  }

  if (filteredRows === 0 && numRows > 0) {
    return <>Ingen treff</>;
  }

  const pageSize = table.getState().pagination.pageSize;
  const currentPage = table.getState().pagination.pageIndex;

  const start = 1 + currentPage * pageSize;
  const end = currentPage * pageSize + currentRows;

  const middleText = currentRows === 0 ? 'ingen' : `${start} til ${end}`;
  const numRowsText =
    filteredRows != numRows ? `${filteredRows} filtrerte` : numRows;

  return (
    <div className="pagination-count">{`Viser ${middleText} av totalt ${numRowsText} element`}</div>
  );
};

export default PaginationCount;
