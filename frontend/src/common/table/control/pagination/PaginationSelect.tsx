import {
  Pagination,
  PaginationButtonProps,
  usePagination,
} from '@digdir/designsystemet-react';
import React from 'react';

import { TableProps } from '../../types';

const PaginationSelect = <T extends object>({ table }: TableProps<T>) => {
  const setCurrentPage = (currentPage: number) =>
    table.setPageIndex(currentPage - 1);
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageOptions().length;

  const onChange = (_event: any, currentPage: number) => {
    table.setPageIndex(currentPage - 1);
    setCurrentPage(currentPage);
  };


  const { pages, prevButtonProps, nextButtonProps } = usePagination({
    currentPage,
    setCurrentPage,
    onChange,
    totalPages: totalPages,
    showPages: 3,
  });



  return (
    <div className="pagination-container__button-list">
      <Pagination>
        <Pagination.List>
          <Pagination.Item>
            <Pagination.Button
              aria-label="Forrige side"
              {...replaceAriaDisabledWithDisabled(prevButtonProps)}
            >
              Forrige
            </Pagination.Button>
          </Pagination.Item>
          {pages.map(({ page, itemKey, buttonProps }) => (
            <Pagination.Item key={itemKey}>
              {typeof page === 'number' && (
                <Pagination.Button {...buttonProps} aria-label={`Side ${page}`}>
                  {page}
                </Pagination.Button>
              )}
            </Pagination.Item>
          ))}
          <Pagination.Item>
            <Pagination.Button
              aria-label="Neste side"
              {...replaceAriaDisabledWithDisabled(nextButtonProps)}
            >
              Neste
            </Pagination.Button>
          </Pagination.Item>
        </Pagination.List>
      </Pagination>
    </div>
  );
};

function replaceAriaDisabledWithDisabled(obj: PaginationButtonProps) {
  const { 'aria-disabled': ariaDisabled, ...rest } = obj;
  if (ariaDisabled === true) {
    return { ...rest, disabled: true };
  }
  return {
    ...rest,
    ...(ariaDisabled !== undefined && { 'aria-disabled': ariaDisabled }),
  };
}

export default PaginationSelect;
