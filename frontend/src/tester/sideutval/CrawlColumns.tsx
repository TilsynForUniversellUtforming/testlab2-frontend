import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { Link } from 'react-router-dom';

import { appRoutes, getFullPath, idPath } from '../../common/appRoutes';
import StatusBadge from '../../common/status-badge/StatusBadge';
import { RowCheckbox } from '../../common/table/control/toggle/IndeterminateCheckbox';
import { sanitizeLabel } from '../../common/util/stringutils';
import { CrawlResultat, Maaling } from '../../maaling/api/types';

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
    id: 'Handling',
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
    cell: ({ row, getValue }) =>
      row.original.type === 'ikkje_starta' ? (
        String(getValue())
      ) : (
        <Link
          to={getFullPath(
            appRoutes.TEST_CRAWLING_RESULT_LIST,
            { pathParam: idPath, id: String(maaling.id) },
            {
              pathParam: ':loeysingId',
              id: String(row.original.loeysing.id),
            }
          )}
          title={`Gå til løysing ${row.original.loeysing.url}`}
        >
          {String(getValue())}
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
    accessorFn: (row) => row.type,
    id: 'status',
    cell: ({ row }) => {
      const urlLength = row.original.urlList?.length;
      const status = row.original.type;
      const crawlSuccess =
        status === 'ferdig' && typeof urlLength !== 'undefined';

      let label: string;
      if (crawlSuccess) {
        label = `Ferdig, fant ${urlLength} sider`;
      } else if (status === 'ikke_ferdig') {
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
            primary: ['ikke_ferdig'],
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
