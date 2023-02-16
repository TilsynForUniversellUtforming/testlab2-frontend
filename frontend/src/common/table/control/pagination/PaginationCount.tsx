import React from 'react';

import { TableProps } from '../../types';

const PaginationCount = ({ table }: TableProps) => {
  const numRows = table.getCoreRowModel().rows.length;
  const currentRows = table.getRowModel().rows.length;

  if (numRows === 0) {
    return <>Ingen element</>;
  }

  const pageSize = table.getState().pagination.pageSize;
  const currentPage = table.getState().pagination.pageIndex;

  const start = 1 + currentPage * pageSize;
  const end = currentPage * pageSize + currentRows;

  const middleText = currentRows === 0 ? 'ingen' : `${start} til ${end}`;

  return <>{`Viser ${middleText} av totalt ${numRows} element`}</>;
};

export default PaginationCount;
