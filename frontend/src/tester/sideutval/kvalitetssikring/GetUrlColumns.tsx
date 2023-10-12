import { getCheckboxColumn } from '@common/table/control/toggle/CheckboxColumn';
import { CrawlUrl } from '@maaling/types';
import { ColumnDef, Row } from '@tanstack/react-table';
import React from 'react';
import { Link } from 'react-router-dom';

export const getUrlColumnsKvalitetssikring = (): Array<ColumnDef<CrawlUrl>> => [
  getCheckboxColumn((row: Row<CrawlUrl>) => `Velg ${row.original.url}`),
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
