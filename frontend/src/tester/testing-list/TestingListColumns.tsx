import LoadingBar from '@common/loading-bar/LoadingBar';
import StatusBadge from '@common/status-badge/StatusBadge';
import {
  HeaderCheckbox,
  RowCheckbox,
} from '@common/table/control/toggle/IndeterminateCheckbox';
import { TestResult } from '@maaling/api/types';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';

/**
 * getTestingListColumns function returns an array of column definitions for TestResult.
 *
 * @returns {Array<ColumnDef<TestResult>>} An array of column definitions.
 */
export const getTestingListColumns = (): Array<ColumnDef<TestResult>> => [
  {
    id: 'testinglist_handling',
    header: ({ table }) => <HeaderCheckbox table={table} />,
    cell: ({ row }) => (
      <RowCheckbox row={row} ariaLabel={`Velg ${row.original.loeysing.namn}`} />
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
    enableColumnFilter: false,
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
