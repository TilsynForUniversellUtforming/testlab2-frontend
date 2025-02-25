import { getCheckboxColumn } from '@common/table/control/toggle/CheckboxColumn';
import { sanitizeEnumLabel } from '@common/util/stringutils';
import { ColumnDef, Row } from '@tanstack/react-table';
import React from 'react';

import { TestregelBase } from '../api/types';

/**
 * getTestregelColumns function returns an array of column definitions for Testregel.
 *
 * @returns {Array<ColumnDef<TestregelBase>>} An array of column definitions.
 */
export const getTestregelColumns = (): Array<ColumnDef<TestregelBase>> => [
  getCheckboxColumn((row: Row<TestregelBase>) => `Velg ${row.original.namn}`),
  {
    accessorFn: (row) => row.namn,
    id: 'testregel-namn',
    cell: (info) => info.getValue(),
    header: () => <>Namn</>,
  },
  {
    accessorFn: (row) => (row.krav ? row.krav.tittel : ''),
    id: 'krav',
    cell: (info) => info.getValue(),
    header: () => <>Krav</>,
    meta: {
      select: true,
    },
  },
  {
    accessorFn: (row) => row.modus,
    id: 'modus',
    cell: (info) => sanitizeEnumLabel(String(info.getValue())),
    header: () => <>Modus</>,
  },
  {
    accessorFn: (row) => row.type,
    id: 'type',
    cell: (info) => sanitizeEnumLabel(String(info.getValue())),
    header: () => <>Type</>,
  },
];

/**
 * getTestregelColumnsReadOnly function returns an array of column definitions for Testregel, without user action.
 *
 * @returns {Array<ColumnDef<TestregelBase>>} An array of column definitions.
 */
export const getTestregelColumnsReadOnly = (): Array<
  ColumnDef<TestregelBase>
> => [
  {
    accessorFn: (row) => row.namn,
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
