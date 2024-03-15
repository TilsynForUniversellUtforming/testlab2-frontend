import { getCheckboxColumn } from '@common/table/control/toggle/CheckboxColumn';
import { TesterResult } from '@maaling/api/types';
import { ColumnDef, Row } from '@tanstack/react-table';
import React from 'react';
import { Link } from 'react-router-dom';

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
    accessorFn: (row) =>
      row.elementOmtale?.description || row.elementOmtale?.pointer,
    id: 'element',
    cell: (info) => info.getValue(),
    header: () => <>Element</>,
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
  // {
  //     accessorFn: (row) => row.kommentar,
  //     id: 'kommentar',
  //     cell: (info) => info.getValue(),
  //     header: () => <>Kommentar</>,
  // },
];
