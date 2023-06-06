import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { Link } from 'react-router-dom';

import { appRoutes, getFullPath, idPath } from '../../common/appRoutes';
import { RowCheckbox } from '../../common/table/control/toggle/IndeterminateCheckbox';
import { Testregel } from '../api/types';

/**
 * getTestregelColumns function returns an array of column definitions for Testregel.
 *
 * @returns {Array<ColumnDef<Testregel>>} An array of column definitions.
 */
export const getTestregelColumns = (): Array<ColumnDef<Testregel>> => [
  {
    id: 'Handling',
    cell: ({ row }) => <RowCheckbox row={row} />,
    size: 1,
  },
  {
    accessorFn: (row) => row.kravTilSamsvar,
    id: 'Navn',
    cell: ({ row, getValue }) => (
      <Link
        to={getFullPath(appRoutes.TESTREGEL_EDIT, {
          pathParam: idPath,
          id: String(row.original.id),
        })}
        title={`Gå til testregel ${row.original.referanseAct}`}
      >
        {String(getValue())}
      </Link>
    ),
    header: () => <>Navn</>,
  },
  {
    accessorFn: (row) => row.referanseAct,
    id: 'TestregelId',
    cell: (info) => info.getValue(),
    header: () => <>Testregel</>,
  },
  {
    accessorFn: (row) => row.krav,
    id: 'Krav',
    cell: (info) => info.getValue(),
    header: () => <>Krav</>,
    meta: {
      select: true,
    },
  },
];
