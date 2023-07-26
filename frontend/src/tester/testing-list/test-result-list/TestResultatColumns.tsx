import { ColumnDef } from '@tanstack/react-table';
import React from 'react';

import { TestResultat } from '../../api/types';

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
 * @returns {Array<ColumnDef<TestResultat>>} An array of column definitions.
 */
export const getTestresultatColumns = (): Array<ColumnDef<TestResultat>> => [
  {
    accessorFn: (row) => row.testregelId,
    id: '_idTestregel',
    cell: (info) => info.getValue(),
    header: () => <>Testregel</>,
  },
  {
    accessorFn: (row) => row.suksesskriterium.join(', '),
    id: '_idSuksesskriterium',
    cell: ({ row }) => <>{row.original.suksesskriterium.join(', ')}</>,
    header: () => <>Suksesskriterium</>,
  },
  {
    accessorFn: (row) => row.side,
    id: 'side',
    cell: (info) => (
      <a href={String(info.getValue())}>{String(info.getValue())}</a>
    ),
    header: () => <>Nettside</>,
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
];
