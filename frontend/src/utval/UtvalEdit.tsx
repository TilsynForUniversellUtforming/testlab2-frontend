import { Utval } from '@utval/types';
import { useLoaderData } from 'react-router';
import { ColumnDef } from '@tanstack/react-table';
import { Loeysing } from '@loeysingar/api/types';
import { useMemo } from 'react';
import UserActionTable from '@common/table/UserActionTable';

export const UtvalEdit = () => {
  const utval = useLoaderData() as Utval;

  const loeysingList = utval.loeysingar;

  const loeysingColumns = useMemo<ColumnDef<Loeysing>[]>(
    () => getUtvalLoeysingColumns(),
    []
  );


  return (
    <div>
      <h1>Rediger Utval</h1>
      <p>Her kan du redigere utval: {utval.namn}</p>
      <UserActionTable<Loeysing>
        heading={'Utval'}
        subHeading={'Loeysingar i utval: ' + loeysingList.length}
        tableProps={{
          data: loeysingList,
          defaultColumns: loeysingColumns,
        }}
      />
      );
    </div>
  );
};

function getUtvalLoeysingColumns(): ColumnDef<Loeysing>[] {
  return [
    {
      accessorFn: (row) => row.namn,
      id: 'namn',
      cell: ({ getValue }) => getValue(),
      header: () => <>Namn</>,
    },
    {
      accessorFn: (row) => row.url,
      id: 'url',
      cell: (info) => info.getValue(),
      header: () => <>URL</>,
    },
    {
      accessorFn: (row) => row.orgnummer,
      id: 'organisasjonsnummer',
      cell: (info) => info.getValue(),
      header: () => <>Organisasjonsnummer</>,
    },
    {
      accessorFn: (row) => row.verksemdnamn,
      id: 'verksemd',
      cell: (info) => info.getValue() || 'Ingen verksemd',
      header: () => <>Verksemd</>,
    },
  ];
}