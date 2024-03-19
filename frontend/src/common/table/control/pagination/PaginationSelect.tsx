import { Pagination } from '@digdir/designsystemet-react';
import React from 'react';

import { TableProps } from '../../types';

const PaginationSelect = <T extends object>({ table }: TableProps<T>) => {
  const setCurrentPage = (currentPage: number) =>
    table.setPageIndex(currentPage - 1);
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageOptions().length;

  return (
    <div className="pagination-container__button-list">
      <Pagination
        size="small"
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={setCurrentPage}
        nextLabel="Neste"
        previousLabel="Forrige"
        itemLabel={(num) => `Side ${num}}`}
        hideLabels
      />
    </div>
  );
};

export default PaginationSelect;
