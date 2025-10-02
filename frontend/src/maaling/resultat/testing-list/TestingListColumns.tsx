import TestlabStatusTag from '@common/status-badge/TestlabStatusTag';
import { getCheckboxColumn } from '@common/table/control/toggle/CheckboxColumn';
import headingWithSorting, { getSeverity } from '@common/table/util';
import { isDefined } from '@common/util/validationUtils';
import { Tag } from '@digdir/designsystemet-react';
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
    accessorFn: (row) => row.loeysing.verksemdNamn,
    id: 'namn',
    cell: (info) => info.getValue(),
    header: () => <>Verksemd</>,
  },
  {
    accessorFn: (row) => row.compliancePercent,
    id: 'compliancePercent',
    cell: ({ row }) =>
      maalingStatus === 'testing_ferdig' && (
        <Tag
          size="small"
          color={getSeverity(row.getValue('compliancePercent'))}
        >
          {row.getValue('compliancePercent') ?? 'Ikkje forekomst'}
        </Tag>
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
        <TestlabStatusTag<JobStatus>
          status={status}
          customLabel={label}
          colorMapping={{
            third: ['starta', 'ikkje_starta'],
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
