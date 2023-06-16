import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { Link } from 'react-router-dom';

import { appRoutes, getFullPath, idPath } from '../../common/appRoutes';
import StatusBadge from '../../common/status-badge/StatusBadge';
import { TestResult } from '../../maaling/api/types';

/**
 * getTestingListColumns function returns an array of column definitions for TestResult.
 *
 * @param {string} maalingId The id of the maaling.
 *
 * @returns {Array<ColumnDef<TestResult>>} An array of column definitions.
 */
export const getTestingListColumns = (
  maalingId: string
): Array<ColumnDef<TestResult>> => [
  {
    accessorFn: (row) => row.loeysing.namn,
    id: 'url',
    cell: ({ row }) => (
      <Link
        to={getFullPath(
          appRoutes.TEST_RESULT_LIST,
          { pathParam: idPath, id: maalingId },
          {
            pathParam: ':loeysingId',
            id: String(row.original.loeysing.id),
          }
        )}
      >
        {row.original.loeysing.namn}
      </Link>
    ),
    header: () => <>Løysing</>,
  },
  {
    accessorFn: (row) => row.loeysing.namn,
    id: 'namn',
    cell: (info) => info.getValue(),
    header: () => <>Verksemd</>,
  },
  {
    accessorFn: (row) => row.tilstand,
    id: 'status',
    cell: ({ row }) => {
      const status = String(row.original.tilstand);
      const fremgang = row.original.framgang;
      let label: string | undefined = undefined;
      if (status === 'starta' && typeof fremgang !== 'undefined') {
        label = `Tester ${fremgang.prosessert} av ${fremgang.maxLenker}`;
      }

      return (
        <StatusBadge
          status={status}
          customLabel={label}
          levels={{
            primary: ['starta', 'ikkje_starta'],
            danger: ['feila'],
            success: ['ferdig'],
          }}
        />
      );
    },
    header: () => <>Status</>,
    meta: {
      select: true,
    },
  },
];
