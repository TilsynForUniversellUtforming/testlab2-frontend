import { getCheckboxColumn } from '@common/table/control/toggle/CheckboxColumn';
import { ColumnDef, Row } from '@tanstack/react-table';
import React from 'react';

import { Loeysing } from '../api/types';

/**
 * getLoeysingColumns function returns an array of column definitions for Loeysing.
 *
 * @returns {Array<ColumnDef<Loeysing>>} An array of column definitions.
 */
export const getLoeysingColumns = (): Array<ColumnDef<Loeysing>> => [
  getCheckboxColumn((row: Row<Loeysing>) => `Velg ${row.original.namn}`),
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
