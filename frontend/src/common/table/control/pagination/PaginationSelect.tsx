import React from 'react';
import { Pagination } from 'react-bootstrap';

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
          <Pagination.Item
            key={pageNumber}
            // eslint-disable-next-line
            onClick={() => table.setPageIndex(index)}
            active={pageNumber === currentPage}
          >
            {pageNumber}
          </Pagination.Item>
        );
      }

      if (!isPageNumberOutOfRange) {
        isPageNumberOutOfRange = true;
        return <Pagination.Ellipsis key={pageNumber} disabled />;
      }

      return null;
    });

    return <>{pageNumbers}</>;
  };

  if (pageCount === 1) {
    return null;
  }

  return (
    <Pagination>
      <Pagination.First
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.setPageIndex(0)}
      />
      <Pagination.Prev
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.previousPage()}
      />
      <PaginationMiddleSection />
      <Pagination.Next
        disabled={!table.getCanNextPage()}
        onClick={() => table.nextPage()}
      />
      <Pagination.Last
        disabled={!table.getCanNextPage()}
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
      />
    </Pagination>
  );
};

export default PaginationSelect;
