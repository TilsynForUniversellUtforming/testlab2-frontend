import StatusBadge from '@common/status-badge/StatusBadge';
import { RowCheckbox } from '@common/table/control/toggle/IndeterminateCheckbox';
import { CellCheckboxId } from '@common/table/types';
import headingWithSorting from '@common/table/util';
import { sanitizeLabel } from '@common/util/stringutils';
import { CrawlResultat, JobStatus, Maaling } from '@maaling/api/types';
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
  maaling?: Maaling
): Array<ColumnDef<CrawlResultat>> => [
  {
    id: CellCheckboxId,
    cell: ({ row }) =>
      maaling?.status === 'kvalitetssikring' && (
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
      headingWithSorting(
        row.framgang?.prosessert ||
          (row.type !== 'feila' ? row.antallNettsider : 0) ||
          0,
        row.type
      ),
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
      } else if (status === 'starta') {
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
        <StatusBadge<JobStatus>
          customLabel={label}
          status={status}
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
