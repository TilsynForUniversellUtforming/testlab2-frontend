import { ColumnDef } from '@tanstack/react-table';
import { Verksemd } from '@verksemder/api/types';
import React from 'react';

export const getVerksemdColumns = (): Array<ColumnDef<Verksemd>> => [
  {
    accessorFn: (row) => row.namn,
    id: 'Verksemd namn',
    cell: ({ getValue }) => getValue(),
    header: () => <>Namn</>,
  },
  {
    accessorFn: (row) => row.organisasjonsnummer,
    id: 'organisasjonsnummer',
    cell: (info) => info.getValue(),
    header: () => <>Organisasjonsnummer</>,
  },
];
