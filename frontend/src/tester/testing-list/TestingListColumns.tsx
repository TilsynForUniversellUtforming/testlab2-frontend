import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { Link } from 'react-router-dom';

import { appRoutes, getFullPath, idPath } from '../../common/appRoutes';
import LoadingBar from '../../common/loading-bar/LoadingBar';
import StatusBadge from '../../common/status-badge/StatusBadge';
import {
  HeaderCheckbox,
  RowCheckbox,
} from '../../common/table/control/toggle/IndeterminateCheckbox';
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
    accessorFn: (row) => row.compliancePercent,
    id: 'compliancePercent',
    cell: ({ row }) => (
      <LoadingBar
        percentage={row.original.compliancePercent}
        tooltip={`${row.original.loeysing.namn} har resultat på ${row.original.compliancePercent}%`}
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

/**
 * getTestingListColumnsLoading function returns an array of column definitions for TestResult, without the checkboxes.
 *
 * @param {string} maalingId The id of the maaling.
 *
 * @returns {Array<ColumnDef<TestResult>>} An array of column definitions.
 */
export const getTestingListColumnsLoading = (
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
    accessorFn: (row) => row.compliancePercent,
    id: 'compliancePercent',
    cell: ({ row }) => (
      <LoadingBar
        percentage={row.original.compliancePercent}
        tooltip={`${row.original.loeysing.namn} har resultat på ${row.original.compliancePercent}%`}
      />
    ),
    header: () => <>Resultat</>,
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.loeysing.namn,
    id: 'namn',
    cell: (info) => info.getValue(),
    header: () => <>Verksemd</>,
    meta: {
      select: true,
    },
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
