import React from 'react';

import { TableProps } from '../../types';

const PaginationCount = ({ table }: TableProps) => {
  const numRows = table.getCoreRowModel().rows.length;
  const currentRows = table.getRowModel().rows;

  const pageSize = table.getState().pagination.pageSize;
  const currentPage = table.getState().pagination.pageIndex;
  const start = 1 + currentPage * pageSize;
  const end = currentPage * pageSize + currentRows.length;

  const middleText = isNaN(start) ? 'ingen' : `${start} til ${end}`;

  return <>{`Viser ${middleText} av totalt ${numRows} element`}</>;
};

export default PaginationCount;
