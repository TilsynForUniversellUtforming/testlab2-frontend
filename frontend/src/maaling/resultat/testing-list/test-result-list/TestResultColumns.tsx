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
    accessorFn: (row) => row.loeysing.namn,
    id: 'loeysing',
    cell: ({ row }) => <>{row.original.loeysing.namn}</>,
    header: () => <>Loeysing</>,
    filterFn: 'exact',
  },
  {
    accessorFn: (row) => row.testregelId,
    id: 'testregelId',
    cell: ({ row }) => <>{row.original.testregelId}</>,
    header: () => <>Testregel</>,
    filterFn: 'exact',
  },
  {
    accessorFn: (row) => row.suksesskriterium,
    id: 'suksesskriterium',
    cell: (info) => info.getValue(),
    header: () => <>Hovudkrav</>,
  },
  {
    accessorFn: (row) => row.compliancePercent,
    id: 'compliancePercent',
    cell: ({ row }) => (
      <LoadingBar
        percentage={row.original.compliancePercent}
        ariaLabel={`${row.original.testregelId} har resultat på ${row.original.compliancePercent}`}
      />
    ),
    header: () => <>Score</>,
  },
  {
    accessorFn: (row) => row.talElementSamsvar + row.talElementBrot,
    id: 'testa',
    cell: ({ row }) => (
      <>{row.original.talElementSamsvar + row.original.talElementBrot}</>
    ),
    header: () => <>Tal testa</>,
  },
  {
    accessorFn: (row) => row.talElementBrot,
    id: 'brot',
    cell: ({ row }) => <>{row.original.talElementBrot}</>,
    header: () => <>Tal brot</>,
  },
  {
    accessorFn: (row) => row.talElementSamsvar,
    id: 'samsvar',
    cell: ({ row }) => <>{row.original.talElementSamsvar}</>,
    header: () => <>Tal samsvar</>,
  },
  {
    accessorFn: (row) => row.talElementVarsel,
    id: 'varsel',
    cell: ({ row }) => <>{row.original.talElementVarsel}</>,
    header: () => <>Tal varsel</>,
  },
  {
    accessorFn: (row) => row.talElementIkkjeForekomst,
    id: 'ikkjetestbar',
    cell: ({ row }) => <>{row.original.talElementIkkjeForekomst}</>,
    header: () => <>Tal ikkje testbar</>,
  },
];
