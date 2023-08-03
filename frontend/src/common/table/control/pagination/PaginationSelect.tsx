import {
  Button,
  ButtonColor,
  ButtonVariant,
} from '@digdir/design-system-react';
import {
  ChevronLeftDoubleIcon,
  ChevronLeftIcon,
  ChevronRightDoubleIcon,
  ChevronRightIcon,
  MenuElipsisHorizontalIcon,
} from '@navikt/aksel-icons';
import React from 'react';

import { TableProps } from '../../types';
import usePaginationKeyPress from './hooks/usePaginationKeyPress';

const PaginationMiddleSection = <T extends object>({
  table,
}: TableProps<T>) => {
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
          aria-label={`Gå til side ${pageNumber}`}
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
          icon={<MenuElipsisHorizontalIcon color="black" />}
          aria-disabled={true}
          aria-label="..."
          disabled
        />
      );
    }

    return null;
  });

  return <>{pageNumbers}</>;
};

const PaginationSelect = <T extends object>({ table }: TableProps<T>) => {
  usePaginationKeyPress({ table });

  return (
    <div className="pagination-container__button-list">
      <Button
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.setPageIndex(0)}
        icon={<ChevronLeftDoubleIcon color="black" />}
        variant={ButtonVariant.Quiet}
        aria-label="Gå til første side"
      />
      <Button
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.previousPage()}
        icon={<ChevronLeftIcon color="black" />}
        variant={ButtonVariant.Quiet}
        aria-label="Gå til forrige side"
      />
      <PaginationMiddleSection table={table} />
      <Button
        disabled={!table.getCanNextPage()}
        onClick={() => table.nextPage()}
        icon={<ChevronRightIcon color="black" />}
        variant={ButtonVariant.Quiet}
        aria-label="Gå til neste side"
      />
      <Button
        disabled={!table.getCanNextPage()}
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        icon={<ChevronRightDoubleIcon color="black" />}
        variant={ButtonVariant.Quiet}
        aria-label="Gå til siste side"
      />
    </div>
  );
};

export default PaginationSelect;
