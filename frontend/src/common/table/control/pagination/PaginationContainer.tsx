import { LegacyTableCell } from '@digdir/design-system-react';
import React from 'react';

import HideWhenLoading from '../../../HideWhenLoading';
import { TableProps } from '../../types';
import PageSizeSelection from './PageSizeSelection';
import PaginationCount from './PaginationCount';
import PaginationSelect from './PaginationSelect';

const PaginationContainer = <T extends object>({
  table,
  loading,
}: TableProps<T> & { loading: boolean }) => {
  const pageOptions = table.getPageOptions();
  const pageCount = pageOptions.length;
  const displayPagination = pageCount > 1;
  const tableElementSize = table.getPreFilteredRowModel().flatRows.length;
  const displayPageSizeSelection = tableElementSize > 10;

  return (
    <>
      <LegacyTableCell colSpan={table.getHeaderGroups()[0].headers.length}>
        <HideWhenLoading loading={loading}>
          <div className="pagination-container">
            {displayPageSizeSelection && (
              <PageSizeSelection table={table} loading={loading} />
            )}
            <PaginationCount table={table} />
            {displayPagination && <PaginationSelect table={table} />}
          </div>
        </HideWhenLoading>
      </LegacyTableCell>
    </>
  );
};

export default PaginationContainer;
