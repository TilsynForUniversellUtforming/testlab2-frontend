import { ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { appRoutes, getFullPath } from '../../common/appRoutes';
import StatusBadge from '../../common/status-badge/StatusBadge';
import TestlabTable from '../../common/table/TestlabTable';
import { CrawlResultat } from '../../maaling/api/types';

export interface Props {
  maalingId: number;
  crawlList: CrawlResultat[];
  error: any;
}

const CrawlingList = ({ maalingId, crawlList, error }: Props) => {
  const crawlColumns = useMemo<ColumnDef<CrawlResultat>[]>(
    () => [
      {
        accessorFn: (row) => row.loeysing.url,
        id: 'url',
        cell: ({ row }) => (
          <Link
            to={`${getFullPath(
              appRoutes.TEST_SIDEUTVAL_LIST,
              String(maalingId)
            )}/${row.original.loeysing.id}`}
          >
            {row.original.loeysing.url}
          </Link>
        ),
        header: () => <span>Løsying</span>,
      },
      {
        accessorFn: (row) => row.loeysing.namn,
        id: 'namn',
        cell: (info) => info.getValue(),
        header: () => <span>Verksemd</span>,
      },
      {
        accessorFn: (row) => row.type,
        id: 'status',
        cell: ({ row }) => {
          const urlLength = row.original.urlList?.length;
          const status = row.original.type;
          const crawlSuccess =
            status === 'ferdig' && typeof urlLength !== 'undefined';

          const label = crawlSuccess
            ? `Ferdig - Fant ${urlLength} sider`
            : status;

          return (
            <StatusBadge
              label={label}
              levels={{
                primary: 'ikke_ferdig',
                danger: 'feilet',
                success: 'ferdig',
                isSuccess: crawlSuccess,
              }}
            />
          );
        },
        header: () => <span>Status</span>,
      },
    ],
    []
  );

  return (
    <TestlabTable<CrawlResultat>
      data={crawlList}
      defaultColumns={crawlColumns}
      error={error}
    />
  );
};

export default CrawlingList;
