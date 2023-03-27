import { TableCell } from '@digdir/design-system-react';
import React from 'react';

import HideWhenLoading from '../../../HideWhenLoading';
import { TableProps } from '../../types';
import PaginationCount from './PaginationCount';
import PaginationSelect from './PaginationSelect';

const PaginationContainer = ({
  table,
  loading,
}: TableProps & { loading: boolean }) => {
  const pageOptions = table.getPageOptions();
  const pageCount = pageOptions.length;
  const displayPagination = pageCount > 1;

  return (
    <>
      <TableCell colSpan={table.getHeaderGroups()[0].headers.length}>
        <HideWhenLoading loading={loading}>
          <div className="pagination-container">
            <PaginationCount table={table} />
            {displayPagination && <PaginationSelect table={table} />}
          </div>
        </HideWhenLoading>
      </TableCell>
    </>
  );
};

export default PaginationContainer;
