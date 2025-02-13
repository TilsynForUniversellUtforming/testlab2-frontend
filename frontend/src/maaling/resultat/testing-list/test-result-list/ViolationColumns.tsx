import { getCheckboxColumn } from '@common/table/control/toggle/CheckboxColumn';
import { TesterResult } from '@maaling/api/types';
import { ColumnDef, Row } from '@tanstack/react-table';
import React from 'react';
import { Link } from 'react-router-dom';

const decodeBase64 = (base64String?: string) => {
  if (typeof base64String === 'undefined') {
    return '';
  }

  try {
    return decodeURIComponent(
      atob(base64String)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  } catch (e) {
    return '';
  }
};

/**
 * getTestresultatColumns function returns an array of column definitions for TestResultat.
 *
 * @returns {Array<ColumnDef<TesterResult>>} An array of column definitions.
 */
export const getTestresultatColumns = (): Array<ColumnDef<TesterResult>> => [
  getCheckboxColumn((row: Row<TesterResult>) => `Velg ${row.original.side}`),
  {
    accessorFn: (row) => row.side,
    id: 'side',
    cell: (info) => (
      <Link to={String(info.getValue())} target="_blank">
        {String(info.getValue())}
      </Link>
    ),
    header: () => <>Nettside</>,
  },
  {
    accessorFn: (row) => row.suksesskriterium.join(', '),
    id: '_idSuksesskriterium',
    cell: ({ row }) => <>{row.original.suksesskriterium.join(', ')}</>,
    header: () => <>Suksesskriterium</>,
  },
  {
    accessorFn: (row) => row.elementOmtale?.htmlCode,
    id: 'htmlCode',
    cell: (info) => <>{decodeBase64(String(info.getValue()))}</>,
    header: () => <>HTML element</>,
  },
  {
    accessorFn: (row) => row.elementOmtale?.pointer,
    id: 'pointer',
    cell: (info) => info.getValue(),
    header: () => <>Peker</>,
  },
  {
    accessorFn: (row) => row.elementUtfall,
    id: 'utfall',
    cell: (info) => info.getValue(),
    header: () => <>Testutfall</>,
  },
];
