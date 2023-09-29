import StatusBadge from '@common/status-badge/StatusBadge';
import { RowCheckbox } from '@common/table/control/toggle/IndeterminateCheckbox';
import { CellCheckboxId } from '@common/table/types';
import { sanitizeLabel } from '@common/util/stringutils';
import { CrawlResultat, Maaling } from '@maaling/api/types';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';

/**
 * getCrawlColumns function returns an array of column definitions for CrawlResultat.
 *
 * @param {object} maaling - The current maaling.
 *
 * @returns {Array<ColumnDef<CrawlResultat>>} An array of column definitions.
 */
export const getCrawlColumns = (
  maaling: Maaling
): Array<ColumnDef<CrawlResultat>> => [
  {
    id: CellCheckboxId,
    cell: ({ row }) =>
      ['planlegging', 'testing', 'testing_ferdig'].includes(
        maaling.status
      ) ? null : (
        <RowCheckbox
          row={row}
          ariaLabel={`Velg ${row.original.loeysing.namn}`}
        />
      ),
    size: 1,
  },
  {
    accessorFn: (row) => row.loeysing.url,
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
    accessorFn: (row) =>
      `${
        row.framgang?.prosessert ||
        (row.type !== 'feilet' ? row.antallNettsider : '') ||
        ''
      }${row.type}`,
    sortingFn: 'alphanumeric',
    id: 'status',
    cell: ({ row }) => {
      const urlLength = row.original.antallNettsider;
      const status = row.original.type;
      const crawlSuccess =
        status === 'ferdig' && typeof urlLength !== 'undefined';

      let label: string;
      if (crawlSuccess) {
        label = `Ferdig, fant ${urlLength} sider`;
      } else if (status === 'crawler') {
        const framgang = row.original.framgang;
        if (framgang != null) {
          label = `Crawler ${framgang.prosessert} av ${framgang.maxLenker}`;
        } else {
          label = 'Crawler';
        }
      } else {
        label = sanitizeLabel(status);
      }

      return (
        <StatusBadge
          customLabel={label}
          status={status}
          levels={{
            primary: ['crawler'],
            danger: ['feilet'],
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
 * getCrawlColumnsLoading function returns an array of column definitions for CrawlResultat, special case because
 * the cells are dependent on maaling.
 *
 * @returns {Array<ColumnDef<CrawlResultat>>} An array of column definitions.
 */
export const getCrawlColumnsLoading = (): Array<ColumnDef<CrawlResultat>> => [
  {
    id: CellCheckboxId,
    cell: () => <></>,
    size: 1,
  },
  {
    accessorFn: (row) => row.loeysing.url,
    id: 'url',
    header: () => <>Løysing</>,
  },
  {
    accessorFn: (row) => row.loeysing.namn,
    id: 'namn',
    header: () => <>Verksemd</>,
  },
  {
    accessorFn: (row) => row.type,
    id: 'status',
    header: () => <>Status</>,
    meta: {
      select: true,
    },
  },
];
