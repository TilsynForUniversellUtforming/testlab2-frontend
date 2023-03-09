import { ColumnDef, Row } from '@tanstack/react-table';
import React, { useCallback, useMemo } from 'react';

import TestlabTable from '../../common/table/TestlabTable';
import { ColumnUserAction } from '../../common/table/user-actions/UserActions';
import { CrawlUrl } from '../../maaling/types';

export interface Props {
  error: any;
  loading?: boolean;
  urls: CrawlUrl[];
}

const KvalitetssikringList = ({ error, loading, urls }: Props) => {
  const doStart = (crawlUrl: CrawlUrl) => {
    console.log('Fjerner ' + crawlUrl.url);
  };

  const onClickDelete = useCallback((e: Row<CrawlUrl>) => {
    doStart(e.original);
  }, []);

  // const onClickStartAll = useCallback((e: Table<Loeysing>) => {
  //   e.getCoreRowModel().rows.map((row) => {
  //     doStart(row.original);
  //   });
  // }, []);

  // const headerUserAction: HeaderUserAction = {
  //   startAllAction: onClickStartAll,
  // };
  const columnUserAction: ColumnUserAction = { deleteAction: onClickDelete };

  const urlColumns = useMemo<ColumnDef<CrawlUrl>[]>(
    () => [
      // {
      //   id: 'Handling',
      //   cell: ({ row }) => <UserActions {...columnUserAction} row={row}/>,
      //   enableSorting: false,
      //   // header: ({ table }) => (
      //   //   <span>
      //   //     <UserTableActions {...headerUserAction} table={table} />
      //   //   </span>
      //   // ),
      //   size: 1,
      // },
      {
        accessorFn: (row) => row.url,
        id: 'url',
        cell: ({ row }) => <a href={row.original.url}>{row.original.url}</a>,
        header: () => <span>URL</span>,
      },
    ],
    []
  );

  return (
    <TestlabTable<CrawlUrl>
      data={urls}
      defaultColumns={urlColumns}
      error={error}
      loading={loading}
    />
  );
};

export default KvalitetssikringList;
