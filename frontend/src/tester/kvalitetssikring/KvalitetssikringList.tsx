import { ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';

import TestlabTable from '../../common/table/TestlabTable';
import { Loeysing } from '../../loeysingar/api/types';

export interface Props {
  error: any;
  loading?: boolean;
  loeysingList: Loeysing[];
}

const KvalitetssikringList = ({ error, loading, loeysingList }: Props) => {
  // const doStart = (loeysing: Loeysing) => {
  //   console.log('starter test for ' + loeysing.url);
  // };
  //
  // const onClickStart = useCallback((e: Row<Loeysing>) => {
  //   doStart(e.original);
  // }, []);
  //
  // const onClickStartAll = useCallback((e: Table<Loeysing>) => {
  //   e.getCoreRowModel().rows.map((row) => {
  //     doStart(row.original);
  //   });
  // }, []);
  //
  // // const headerUserAction: HeaderUserAction = {
  // //   startAllAction: onClickStartAll,
  // // };
  // const columnUserAction: ColumnUserAction = { startAction: onClickStart };

  const loeysingColumns = useMemo<ColumnDef<Loeysing>[]>(
    () => [
      // {
      //   id: 'Handling',
      //   cell: ({ row }) => <UserActions {...columnUserAction} row={row} />,
      //   enableSorting: false,
      //   header: ({ table }) => (
      //     <span>
      //       <UserTableActions {...headerUserAction} table={table} />
      //     </span>
      //   ),
      //   size: 1,
      // },
      {
        accessorFn: (row) => row.namn,
        id: 'Navn',
        cell: (info) => info.getValue(),
        header: () => <span>Navn</span>,
      },
      {
        accessorFn: (row) => row.url,
        id: 'url',
        cell: (info) => info.getValue(),
        header: () => <span>URL</span>,
      },
    ],
    []
  );

  return (
    <TestlabTable<Loeysing>
      data={loeysingList}
      defaultColumns={loeysingColumns}
      error={error}
      loading={loading}
    />
  );
};

export default KvalitetssikringList;
