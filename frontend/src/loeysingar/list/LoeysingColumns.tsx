import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { Link } from 'react-router-dom';

import { appRoutes, getFullPath, idPath } from '../../common/appRoutes';
import {
  HeaderCheckbox,
  RowCheckbox,
} from '../../common/table/control/toggle/IndeterminateCheckbox';
import { Loeysing } from '../api/types';

/**
 * getLoeysingColumns function returns an array of column definitions for Loeysing.
 *
 * @returns {Array<ColumnDef<Loeysing>>} An array of column definitions.
 */
export const getLoeysingColumns = (): Array<ColumnDef<Loeysing>> => [
  {
    id: 'Handling',
    header: ({ table }) => <HeaderCheckbox table={table} />,
    cell: ({ row }) => (
      <RowCheckbox row={row} ariaLabel={`Velg ${row.original.namn}`} />
    ),
    size: 1,
  },
  {
    accessorFn: (row) => row.namn,
    id: 'loeysing-namn',
    cell: ({ row, getValue }) => (
      <Link
        to={getFullPath(appRoutes.LOEYSING_EDIT, {
          pathParam: idPath,
          id: String(row.original.id),
        })}
      >
        {String(getValue())}
      </Link>
    ),
    header: () => <span>Namn</span>,
  },
  {
    accessorFn: (row) => row.url,
    id: 'url',
    cell: (info) => info.getValue(),
    header: () => <span>URL</span>,
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
    id: 'loeysing-namn',
    cell: ({ row, getValue }) => (
      <Link
        to={getFullPath(appRoutes.LOEYSING_EDIT, {
          pathParam: idPath,
          id: String(row.original.id),
        })}
      >
        {String(getValue())}
      </Link>
    ),
    header: () => <span>Namn</span>,
  },
  {
    accessorFn: (row) => row.url,
    id: 'url',
    cell: (info) => info.getValue(),
    header: () => <span>URL</span>,
  },
];
