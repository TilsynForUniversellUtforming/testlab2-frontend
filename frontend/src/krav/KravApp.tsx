import UserActionTable from '@common/table/UserActionTable';
import { Checkbox } from '@digdir/designsystemet-react';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { useLoaderData } from 'react-router-dom';

import { Krav } from './types';

const KravApp = () => {
  const kravliste = useLoaderData() as Krav[];

  console.log(JSON.stringify(kravliste));

  const kravColumns = kravColumnDefs();

  return (
    <UserActionTable<Krav>
      heading="Verksemder"
      subHeading="Liste over alle verksemder"
      tableProps={{
        data: kravliste,
        defaultColumns: kravColumns,
      }}
    />
  );
};

export default KravApp;

const kravColumnDefs = (): Array<ColumnDef<Krav>> => [
  {
    accessorFn: (row) => row.tittel,
    id: 'Tittel',
    cell: ({ getValue }) => getValue(),
    header: () => <>Tittel</>,
  },
  {
    accessorFn: (row) => row.suksesskriterium,
    id: 'suksesskriterium',
    cell: ({ getValue }) => getValue(),
    header: () => <>Suksesskriterium</>,
  },
  {
    accessorFn: (row) => row.gjeldNettsider,
    id: 'gjeldNettsider',
    cell: ({ getValue }) => <Checkbox checked={getValue()} readOnly={true} />,
    header: () => <>Gjeld nettside</>,
  },
  {
    accessorFn: (row) => row.gjeldApp,
    id: 'gjeldApp',
    cell: ({ getValue }) => <Checkbox checked={getValue()} readOnly={true} />,
    header: () => <>Gjeld app</>,
  },
  {
    accessorFn: (row) => row.gjeldAutomat,
    id: 'gjeldAutomat',
    cell: ({ getValue }) => <Checkbox checked={getValue()} readOnly={true} />,
    header: () => <>Gjeld automat</>,
  },
  {
    accessorFn: (row) => row.prinsipp,
    id: 'prinsipp',
    cell: ({ getValue }) => getValue(),
    header: () => <>Prinsipp</>,
  },
  {
    accessorFn: (row) => row.retningslinje,
    id: 'rettninglinje',
    cell: ({ getValue }) => getValue(),
    header: () => <>Rettningslinje</>,
  },

  {
    accessorFn: (row) => row.samsvarsnivaa,
    id: 'samsvarsnivaa',
    cell: ({ getValue }) => getValue(),
    header: () => <>Samsvarsnivaa</>,
  },
  {
    accessorFn: (row) => row.status,
    id: 'status',
    cell: ({ getValue }) => getValue(),
    header: () => <>Status</>,
  },
];
