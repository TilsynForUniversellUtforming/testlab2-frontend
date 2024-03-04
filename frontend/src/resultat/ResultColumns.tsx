import { getCheckboxColumn } from '@common/table/control/toggle/CheckboxColumn';
import { AutotesterResult } from '@maaling/api/types';
import { ColumnDef, Row } from '@tanstack/react-table';
import React from 'react';
import { Link } from 'react-router-dom';
/**
 * getTestresultatColumns function returns an array of column definitions for TestResultat.
 *
 * @returns {Array<ColumnDef<AutotesterResult>>} An array of column definitions.
 */
export const getTestresultatColumns = (): Array<
  ColumnDef<AutotesterResult>
> => [
  getCheckboxColumn(
    (row: Row<AutotesterResult>) => `Velg ${row.original.side}`
  ),
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
    accessorFn: (row) => row.elementResultat,
    id: 'testresultat',
    cell: (info) => info.getValue(),
    header: () => <>Testresultat</>,
  },
  {
    accessorFn: (row) => row.elementUtfall,
    id: 'utfall',
    cell: (info) => info.getValue(),
    header: () => <>Testutfall</>,
  },
];
