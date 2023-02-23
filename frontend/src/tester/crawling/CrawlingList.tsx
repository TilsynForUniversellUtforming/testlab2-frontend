import { ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';

import TestlabTable from '../../common/table/TestlabTable';
import { CrawlResultat } from '../../maaling/api/types';

export interface Props {
  crawlList: CrawlResultat[];
  error: any;
  loading?: boolean;
}

const CrawlingList = ({ crawlList, error, loading }: Props) => {
  const crawlColumns = useMemo<ColumnDef<CrawlResultat>[]>(
    () => [
      {
        accessorFn: (row) => row.status,
        id: 'status',
        cell: (info) => info.getValue(),
        header: () => <span>Status</span>,
      },
      {
        accessorFn: (row) => row.loeysing.namn,
        id: 'namn',
        cell: (info) => info.getValue(),
        header: () => <span>Namn</span>,
      },
      {
        accessorFn: (row) => row.loeysing.url,
        id: 'url',
        cell: (info) => info.getValue(),
        header: () => <span>URL</span>,
      },
    ],
    []
  );

  return (
    <TestlabTable<CrawlResultat>
      data={crawlList}
      defaultColumns={crawlColumns}
      error={error}
      loading={loading}
    />
  );
};

export default CrawlingList;
