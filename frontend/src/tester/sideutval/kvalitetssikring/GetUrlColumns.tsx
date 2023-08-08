import { RowCheckbox } from '@common/table/control/toggle/IndeterminateCheckbox';
import { CellCheckboxId } from '@common/table/types';
import { CrawlUrl } from '@maaling/types';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { Link } from 'react-router-dom';

export const getUrlColumnsKvalitetssikring = (): Array<ColumnDef<CrawlUrl>> => [
  {
    id: CellCheckboxId,
    cell: ({ row }) => (
      <RowCheckbox row={row} ariaLabel={`Velg ${row.original.url}`} />
    ),
    size: 1,
  },
  {
    accessorFn: (row) => row.url,
    id: 'url',
    cell: ({ row }) => (
      <Link to={row.original.url} target="_blank">
        {row.original.url}
      </Link>
    ),
    header: () => <>URL</>,
  },
];

export const getUrlColumns = (): Array<ColumnDef<CrawlUrl>> => [
  {
    accessorFn: (row) => row.url,
    id: 'url',
    cell: ({ row }) => (
      <Link to={row.original.url} target="_blank">
        {row.original.url}
      </Link>
    ),
    header: () => <>URL</>,
  },
];
