import LoadingBar from '@common/loading-bar/LoadingBar';
import StatusBadge from '@common/status-badge/StatusBadge';
import { getCheckboxColumn } from '@common/table/control/toggle/CheckboxColumn';
import headingWithSorting from '@common/table/util';
import { isDefined } from '@common/util/validationUtils';
import { JobStatus, MaalingStatus, TestResult } from '@maaling/api/types';
import { ColumnDef, Row } from '@tanstack/react-table';
import React from 'react';

/**
 * getTestingListColumns function returns an array of column definitions for TestResult.
 *
 * @param {MaalingStatus} maalingStatus - The status of the current maaling.
 *
 * @returns {Array<ColumnDef<TestResult>>} An array of column definitions.
 */
export const getTestingListColumns = (
  maalingStatus?: MaalingStatus
): Array<ColumnDef<TestResult>> => [
  getCheckboxColumn(
    (row: Row<TestResult>) => `Velg ${row.original.loeysing.namn}`,
    false,
    maalingStatus === 'testing_ferdig'
  ),
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
    cell: ({ row }) =>
      maalingStatus === 'testing_ferdig' && (
        <LoadingBar
          percentage={row.original.compliancePercent}
          ariaLabel={`${row.original.loeysing.namn} har resultat på ${row.original.compliancePercent}%`}
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
