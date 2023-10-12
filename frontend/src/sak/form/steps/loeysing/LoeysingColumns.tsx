import { appRoutes, getFullPath, idPath } from '@common/appRoutes';
import { getCheckboxColumn } from '@common/table/control/toggle/CheckboxColumn';
import { LoeysingVerksemd } from '@sak/types';
import { ColumnDef, Row } from '@tanstack/react-table';
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * getLoeysingColumns function returns an array of column definitions for LoeysingVerksemd.
 *
 * @returns {Array<ColumnDef<LoeysingVerksemd>>} An array of column definitions.
 */
export const getLoeysingVerksemdColumns = (): Array<
  ColumnDef<LoeysingVerksemd>
> => [
  getCheckboxColumn(
    (row: Row<LoeysingVerksemd>) =>
      `Velg ${row.original.loeysing.namn} - ${row.original.verksemd.namn}`,
    true
  ),
  {
    accessorFn: (row) => row.loeysing.namn,
    id: 'url',
    cell: ({ row, getValue }) => (
      <Link
        to={getFullPath(appRoutes.LOEYSING_EDIT, {
          pathParam: idPath,
          id: String(row.original.loeysing.id),
        })}
        target="_blank"
      >
        {String(getValue())}
      </Link>
    ),
    header: () => <>Namn på løysing</>,
  },
  {
    accessorFn: (row) => row.verksemd.namn,
    id: 'namn',
    cell: (info) => info.getValue(),
    header: () => <span>Ansvarleg verksemd</span>,
  },
];
