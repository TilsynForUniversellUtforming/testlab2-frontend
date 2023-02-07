import React from 'react';

import { TableProps } from '../../types';

const PaginationCount = ({ table }: TableProps) => {
  const numRows = table.getCoreRowModel().rows.length;
  const currentRows = table.getRowModel().rows;
  const selectionRowStart = currentRows[0]?.index + 1;
  const selectionRowEnd = currentRows[currentRows.length - 1]?.index + 1;

  const middleText = isNaN(selectionRowStart)
    ? 'ingen'
    : `${selectionRowStart} til ${selectionRowEnd}`;

  return <>{`Viser ${middleText} av totalt ${numRows} element`}</>;
};

export default PaginationCount;
