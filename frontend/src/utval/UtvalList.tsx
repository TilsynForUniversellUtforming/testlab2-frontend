import { useLoaderData, useNavigate } from 'react-router';
import { Utval } from '@utval/types';
import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import UserActionTable from '@common/table/UserActionTable';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { UTVAL_EDIT } from '@utval/UtvalRoutes';

export const UtvalList = () => {
  const utvalList = useLoaderData() as Utval[];
  const navigate = useNavigate();


  const utvalColumns = useMemo<ColumnDef<Utval>[]>(() => getUtvalColumns(), []);



  return (
    <UserActionTable<Utval>
      heading={'Utval'}
      tableProps={{
        data: utvalList,
        defaultColumns: utvalColumns,
        onClickRow: (row) =>
          navigate(
            getFullPath(UTVAL_EDIT, {
              pathParam: idPath,
              id: String(row?.original.id),
            })
          ),
      }}
    />
  );
}

function getUtvalColumns(): ColumnDef<Utval>[] {
  return [
    {
      accessorFn: (row) => row.namn,
      id: 'utval namn',
      cell: ({ getValue }) => getValue(),
      header: () => <>Namn</>,
    },
  ];
}