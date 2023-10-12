import LoadingBar from '@common/loading-bar/LoadingBar';
import StatusBadge from '@common/status-badge/StatusBadge';
import { RowCheckbox } from '@common/table/control/toggle/IndeterminateCheckbox';
import headingWithSorting from '@common/table/util';
import { isDefined } from '@common/util/util';
import { JobStatus, Maaling, TestResult } from '@maaling/api/types';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';

/**
 * getTestingListColumns function returns an array of column definitions for TestResult.
 *
 * @param {object} maaling - The current maaling.
 *
 * @returns {Array<ColumnDef<TestResult>>} An array of column definitions.
 */
export const getTestingListColumns = (
  maaling?: Maaling
): Array<ColumnDef<TestResult>> => [
  {
    id: 'testinglist_handling',
    cell: ({ row }) =>
      maaling?.status === 'testing_ferdig' && (
        <RowCheckbox
          row={row}
          ariaLabel={`Velg ${row.original.loeysing.namn}`}
        />
      ),
    size: 1,
  },
  {
    accessorFn: (row) => row.loeysing.namn,
    id: 'url',
    cell: ({ getValue }) => getValue(),
    header: () => <>Løysing</>,
  },
  {
    accessorFn: (row) => row.loeysing.namn,
    id: 'namn',
    cell: (info) => info.getValue(),
    header: () => <>Verksemd</>,
  },
  {
    accessorFn: (row) => row.compliancePercent,
    id: 'compliancePercent',
    cell: ({ row }) => (
      <LoadingBar
        percentage={row.original.compliancePercent}
        tooltip={`${row.original.loeysing.namn} har resultat på ${row.original.compliancePercent}%`}
        show={row.original.tilstand === 'ferdig'}
      />
    ),
    header: () => <>Resultat</>,
  },
  {
    accessorFn: (row) =>
      headingWithSorting(
        row.framgang?.prosessert ||
          (row.tilstand !== 'feila' ? row.antalSider : 0) ||
          0,
        row.tilstand
      ),
    sortingFn: 'alphanumeric',
    id: 'status',
    cell: ({ row }) => {
      const status = String(row.original.tilstand);
      const fremgang = row.original.framgang;
      const antalSider = row.original.antalSider;
      let label: string | undefined = undefined;
      if (status === 'starta' && typeof fremgang !== 'undefined') {
        label = `Tester ${fremgang.prosessert} av ${fremgang.maxLenker}`;
      } else if (status === 'ferdig' && isDefined(antalSider)) {
        label = `Ferdig, testa ${row.original.antalSider}`;
      }

      return (
        <StatusBadge<JobStatus>
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
