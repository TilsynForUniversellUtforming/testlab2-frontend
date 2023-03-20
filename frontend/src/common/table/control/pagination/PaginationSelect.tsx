import React from 'react';

import { TableProps } from '../../types';
import usePaginationKeyPress from './hooks/usePaginationKeyPress';

const PaginationSelect = ({ table }: TableProps) => {
  usePaginationKeyPress({ table });

  // eslint-disable-next-line
  const pageOptions = table.getPageOptions();
  const pageCount = pageOptions.length;

  const PaginationMiddleSection = () => {
    let isPageNumberOutOfRange: boolean;

    const pageNumbers = [...pageOptions].map((_, index) => {
      const pageNumber = index + 1;
      const isPageNumberFirst = pageNumber === 1;
      const isPageNumberLast = pageNumber === pageCount;
      // eslint-disable-next-line
      const currentPage = table.getState().pagination.pageIndex + 1;

      const isCurrentPageWithinTwoPageNumbers =
        Math.abs(pageNumber - currentPage) <= 2;

      if (
        isPageNumberFirst ||
        isPageNumberLast ||
        isCurrentPageWithinTwoPageNumbers
      ) {
        isPageNumberOutOfRange = false;

        return (
          // Pagination.Item
          <button
            key={pageNumber}
            // eslint-disable-next-line
            onClick={() => table.setPageIndex(index)}
            // active={pageNumber === currentPage}
          >
            {pageNumber}
          </button>
        );
      }

      if (!isPageNumberOutOfRange) {
        isPageNumberOutOfRange = true;
        // Pagination.Ellipsis - disabled
        return <div key={pageNumber}>...</div>;
      }

      return null;
    });

    return <>{pageNumbers}</>;
  };

  if (pageCount <= 1) {
    return null;
  }

  return (
    <div>
      {/*Pagination.First*/}
      <button
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.setPageIndex(0)}
      >{`<<`}</button>
      {/*Pagination.Prev*/}
      <button
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.previousPage()}
      >
        {`<`}
      </button>
      <PaginationMiddleSection />
      {/*Pagination.Next*/}
      <button
        disabled={!table.getCanNextPage()}
        onClick={() => table.nextPage()}
      >
        {`>`}
      </button>
      {/*Pagination.Last*/}
      <button
        disabled={!table.getCanNextPage()}
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
      >
        {`>>`}
      </button>
    </div>
  );
};

export default PaginationSelect;
