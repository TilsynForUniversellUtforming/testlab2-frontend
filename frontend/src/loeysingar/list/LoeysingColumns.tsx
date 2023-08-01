import {
  HeaderCheckbox,
  RowCheckbox,
} from '@common/table/control/toggle/IndeterminateCheckbox';
import { CellCheckboxId } from '@common/table/types';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';

import { Loeysing } from '../api/types';

/**
 * getLoeysingColumns function returns an array of column definitions for Loeysing.
 *
 * @returns {Array<ColumnDef<Loeysing>>} An array of column definitions.
 */
export const getLoeysingColumns = (): Array<ColumnDef<Loeysing>> => [
  {
    id: CellCheckboxId,
    header: ({ table }) => <HeaderCheckbox table={table} />,
    cell: ({ row }) => (
      <RowCheckbox row={row} ariaLabel={`Velg ${row.original.namn}`} />
    ),
    size: 1,
  },
  {
    accessorFn: (row) => row.namn,
    id: 'løsying namn',
    cell: ({ getValue }) => getValue(),
    header: () => <>Namn</>,
  },
  {
    accessorFn: (row) => row.url,
    id: 'url',
    cell: (info) => info.getValue(),
    header: () => <>URL</>,
  },
  {
    accessorFn: (row) => row.orgnummer,
    id: 'organisasjonsnummer',
    cell: (info) => info.getValue(),
    header: () => <>Organisasjonsnummer</>,
  },
];

/**
 * getLoeysingColumnsReadOnly function returns an array of column definitions for Loeysing, without user action.
 *
 * @returns {Array<ColumnDef<Loeysing>>} An array of column definitions.
 */
export const getLoeysingColumnsReadOnly = (): Array<ColumnDef<Loeysing>> => [
  {
    accessorFn: (row) => row.namn,
    id: 'løysing namn',
    cell: ({ getValue }) => getValue(),
    header: () => <>Namn</>,
  },
  {
    accessorFn: (row) => row.url,
    id: 'url',
    cell: (info) => info.getValue(),
    header: () => <>URL</>,
  },
  {
    accessorFn: (row) => row.orgnummer,
    id: 'organisasjonsnummer',
    cell: (info) => info.getValue(),
    header: () => <>Organisasjonsnummer</>,
  },
];
