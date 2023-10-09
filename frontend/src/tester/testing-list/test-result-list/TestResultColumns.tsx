import LoadingBar from '@common/loading-bar/LoadingBar';
import { AggregatedTestresult } from '@maaling/api/types';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';

/**
 * getAggregatedResultColumns function returns an array of column definitions for AggregatedTestresult.
 *
 * @returns {Array<ColumnDef<AggregatedTestresult>>} An array of column definitions.
 */
export const getAggregatedResultColumns = (): Array<
  ColumnDef<AggregatedTestresult>
> => [
  {
    accessorFn: (row) => row.testregelId,
    id: 'testregelId',
    cell: ({ row }) => <>{row.original.testregelId}</>,
    header: () => <>Testregel</>,
    meta: {
      select: true,
    },
    filterFn: 'exact',
  },
  {
    accessorFn: (row) => row.suksesskriterium,
    id: 'suksesskriterium',
    cell: (info) => info.getValue(),
    header: () => <>Krav</>,
    meta: {
      select: true,
    },
  },
  {
    accessorFn: (row) => row.compliancePercent,
    id: 'compliancePercent',
    cell: ({ row }) => (
      <LoadingBar
        percentage={row.original.compliancePercent}
        tooltip={`${row.original.testregelId} har resultat på ${row.original.compliancePercent}%`}
      />
    ),
    header: () => <>Score</>,
  },
  {
    accessorFn: (row) =>
      row.talSiderSamsvar + row.talSiderIkkjeForekomst + row.talSiderBrot,
    id: 'testa',
    cell: ({ row }) => (
      <>
        {row.original.talSiderSamsvar +
          row.original.talSiderIkkjeForekomst +
          row.original.talSiderBrot}
      </>
    ),
    header: () => <>Tal testa</>,
  },
  {
    accessorFn: (row) => row.talSiderBrot,
    id: 'brot',
    cell: ({ row }) => <>{row.original.talSiderBrot}</>,
    header: () => <>Tal brot</>,
  },
  {
    accessorFn: (row) => row.talSiderSamsvar,
    id: 'samsvar',
    cell: ({ row }) => <>{row.original.talSiderSamsvar}</>,
    header: () => <>Tal samsvar</>,
  },
  {
    accessorFn: (row) => row.talSiderIkkjeForekomst,
    id: 'ikkjeForekomst',
    cell: ({ row }) => <>{row.original.talSiderIkkjeForekomst}</>,
    header: () => <>Tal ikkje-forekomst</>,
  },
];
