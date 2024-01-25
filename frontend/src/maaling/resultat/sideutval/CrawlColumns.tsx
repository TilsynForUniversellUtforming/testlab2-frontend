import TestlabStatusTag from '@common/status-badge/TestlabStatusTag';
import { getCheckboxColumn } from '@common/table/control/toggle/CheckboxColumn';
import headingWithSorting from '@common/table/util';
import { sanitizeEnumLabel } from '@common/util/stringutils';
import { CrawlResultat, JobStatus, Maaling } from '@maaling/api/types';
import { ColumnDef, Row } from '@tanstack/react-table';
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
  getCheckboxColumn(
    (row: Row<CrawlResultat>) => `Velg ${row.original.loeysing.namn}`,
    false,
    maaling?.status === 'kvalitetssikring'
  ),
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
        label = sanitizeEnumLabel(status);
      }

      return (
        <TestlabStatusTag<JobStatus>
          customLabel={label}
          status={status}
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
