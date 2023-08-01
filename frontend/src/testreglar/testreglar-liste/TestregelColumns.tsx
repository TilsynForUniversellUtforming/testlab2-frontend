import { RowCheckbox } from '@common/table/control/toggle/IndeterminateCheckbox';
import { CellCheckboxId } from '@common/table/types';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';

import { Testregel } from '../api/types';

/**
 * getTestregelColumns function returns an array of column definitions for Testregel.
 *
 * @returns {Array<ColumnDef<Testregel>>} An array of column definitions.
 */
export const getTestregelColumns = (): Array<ColumnDef<Testregel>> => [
  {
    id: CellCheckboxId,
    cell: ({ row }) => (
      <RowCheckbox
        row={row}
        ariaLabel={`Velg ${row.original.testregelNoekkel} - ${row.original.kravTilSamsvar}`}
      />
    ),
    size: 1,
  },
  {
    accessorFn: (row) => row.testregelNoekkel,
    id: 'testregel',
    cell: (info) => info.getValue(),
    header: () => <>Testregel</>,
  },
  {
    accessorFn: (row) => row.kravTilSamsvar,
    id: 'testregel-namn',
    cell: (info) => info.getValue(),
    header: () => <>Namn</>,
  },
  {
    accessorFn: (row) => row.krav,
    id: 'krav',
    cell: (info) => info.getValue(),
    header: () => <>Krav</>,
    meta: {
      select: true,
    },
  },
];

/**
 * getTestregelColumnsReadOnly function returns an array of column definitions for Testregel, without user action.
 *
 * @returns {Array<ColumnDef<Testregel>>} An array of column definitions.
 */
export const getTestregelColumnsReadOnly = (): Array<ColumnDef<Testregel>> => [
  {
    accessorFn: (row) => row.testregelNoekkel,
    id: 'testregel',
    cell: (info) => info.getValue(),
    header: () => <>Testregel</>,
  },
  {
    accessorFn: (row) => row.kravTilSamsvar,
    id: 'testregel namn',
    cell: ({ getValue }) => getValue(),
    header: () => <>Namn</>,
  },
  {
    accessorFn: (row) => row.krav,
    id: 'krav',
    cell: (info) => info.getValue(),
    header: () => <>Krav</>,
    meta: {
      select: true,
    },
  },
];
