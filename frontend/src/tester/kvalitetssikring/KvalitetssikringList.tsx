import { ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';

import { RowCheckbox } from '../../common/table/control/toggle/IndeterminateCheckbox';
import TestlabTable from '../../common/table/TestlabTable';
import { CrawlUrl } from '../../maaling/types';

export interface Props {
  error: any;
  loading?: boolean;
  onSelectRows: (rowSelection: CrawlUrl[]) => void;
  crawlUrls: CrawlUrl[];
}

const KvalitetssikringList = ({
  error,
  loading,
  onSelectRows,
  crawlUrls,
}: Props) => {
  const urlColumns = useMemo<ColumnDef<CrawlUrl>[]>(
    () => [
      {
        id: 'Handling',
        cell: ({ row }) => <RowCheckbox row={row} />,
        size: 1,
      },
      {
        accessorFn: (row) => row.url,
        id: 'url',
        cell: ({ row }) => <a href={row.original.url}>{row.original.url}</a>,
        header: () => <span>URL</span>,
      },
    ],
    []
  );

  if (crawlUrls.length === 0) {
    return <>Ingen resultat</>;
  }

  return (
    <TestlabTable<CrawlUrl>
      data={crawlUrls}
      defaultColumns={urlColumns}
      onSelectRows={onSelectRows}
      error={error}
      loading={loading}
      filterPreference={'searchbar'}
    />
  );
};

export default KvalitetssikringList;
