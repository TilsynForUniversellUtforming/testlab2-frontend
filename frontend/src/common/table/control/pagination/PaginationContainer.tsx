import { TableCell } from '@digdir/design-system-react';
import React from 'react';

import { TableProps } from '../../types';
import PaginationCount from './PaginationCount';
import PaginationSelect from './PaginationSelect';

const PaginationContainer = ({ table }: TableProps) => {
  const pageOptions = table.getPageOptions();
  const pageCount = pageOptions.length;
  const displayPagination = pageCount > 1;
  const colSpan =
    table.getHeaderGroups()[0].headers.length - (displayPagination ? 1 : 0);

  return (
    <>
      <TableCell colSpan={colSpan}>
        <PaginationCount table={table} />
      </TableCell>
      {displayPagination && <PaginationSelect table={table} />}
    </>
  );
};

export default PaginationContainer;
