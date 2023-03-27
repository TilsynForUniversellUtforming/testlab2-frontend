import {
  Button,
  ButtonColor,
  ButtonVariant,
} from '@digdir/design-system-react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MoreHorizontalIcon,
} from '@digdir/ds-icons';
import React from 'react';

import { TableProps } from '../../types';
import usePaginationKeyPress from './hooks/usePaginationKeyPress';

const PaginationMiddleSection = ({ table }: TableProps) => {
  const pageOptions = table.getPageOptions();
  const pageCount = pageOptions.length;

  let isPageNumberOutOfRange: boolean;

  const pageNumbers = [...pageOptions].map((_, index) => {
    const pageNumber = index + 1;
    const isPageNumberFirst = pageNumber === 1;
    const isPageNumberLast = pageNumber === pageCount;
    const currentPage = table.getState().pagination.pageIndex + 1;

    const isCurrentPageWithinTwoPageNumbers =
      Math.abs(pageNumber - currentPage) <= 2;

    if (
      isPageNumberFirst ||
      isPageNumberLast ||
      isCurrentPageWithinTwoPageNumbers
    ) {
      isPageNumberOutOfRange = false;
      const buttonVariant: ButtonVariant =
        pageNumber === currentPage
          ? ButtonVariant.Outline
          : ButtonVariant.Quiet;

      return (
        <Button
          className="number-button"
          key={pageNumber}
          onClick={() => table.setPageIndex(index)}
          variant={buttonVariant}
          color={ButtonColor.Secondary}
        >
          {pageNumber}
        </Button>
      );
    }

    if (!isPageNumberOutOfRange) {
      isPageNumberOutOfRange = true;
      return (
        <Button
          variant={ButtonVariant.Quiet}
          key={pageNumber}
          icon={<MoreHorizontalIcon />}
          disabled
        />
      );
    }

    return null;
  });

  return <>{pageNumbers}</>;
};

const PaginationSelect = ({ table }: TableProps) => {
  usePaginationKeyPress({ table });

  return (
    <div className="pagination-container__button-list">
      <Button
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.setPageIndex(0)}
        icon={<ChevronsLeftIcon />}
        variant={ButtonVariant.Quiet}
      />
      <Button
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.previousPage()}
        icon={<ChevronLeftIcon />}
        variant={ButtonVariant.Quiet}
      />
      <PaginationMiddleSection table={table} />
      <Button
        disabled={!table.getCanNextPage()}
        onClick={() => table.nextPage()}
        icon={<ChevronRightIcon />}
        variant={ButtonVariant.Quiet}
      />
      <Button
        disabled={!table.getCanNextPage()}
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        icon={<ChevronsRightIcon />}
        variant={ButtonVariant.Quiet}
      />
    </div>
  );
};

export default PaginationSelect;
