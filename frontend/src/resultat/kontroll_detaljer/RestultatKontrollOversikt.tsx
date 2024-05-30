import LoadingBar from '@common/loading-bar/LoadingBar';
import { TestlabSeverity } from '@common/types';
import { Tag } from '@digdir/designsystemet-react';
import ResultatKontrollOverviewTable from '@resultat/kontroll_detaljer/ResultatKontrollOverviewTable';
import { Resultat } from '@resultat/types';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';

const RestultatKontrollOversikt = () => {
  const resultat: Array<Resultat> = useLoaderData() as Array<Resultat>;
  useNavigate();

  const getSeverity = (percentage: number): TestlabSeverity => {
    if (percentage < 60) return 'danger';
    if (percentage < 90) return 'warning';
    return 'success';
  };
  const columns: Array<ColumnDef<Resultat>> = [
    {
      accessorKey: 'namnVerksemd',
      header: 'Verksemder',
      enableGlobalFilter: false,
      enableColumnFilter: false,
    },

    {
      accessorKey: 'namnLoeysing',
      header: 'Løysing',
      enableColumnFilter: false,
      enableGlobalFilter: false,
    },
    {
      accessorKey: 'progresjon',
      header: 'Progresjon',
      enableGlobalFilter: false,
      enableColumnFilter: false,
      cell: ({ row }) => (
        <LoadingBar
          percentage={row.getValue('progresjon')}
          ariaLabel={`${row.getValue('namnLoeysing')} har resultat på ${row.getValue('progresjon')}`}
        />
      ),
    },
    {
      accessorKey: 'score',
      header: 'Resultat',
      enableGlobalFilter: false,
      enableColumnFilter: false,
      cell: ({ row }) => (
        <Tag size="small" color={getSeverity(row.getValue('score'))}>
          {row.getValue('score')}
        </Tag>
      ),
    },
    {
      accessorKey: 'testar',
      header: 'testar',
      enableGlobalFilter: false,
      enableColumnFilter: false,
    },

    {
      accessorKey: 'talElementSamsvar',
      header: 'talElementSamsvar',
      enableGlobalFilter: false,
      enableColumnFilter: false,
    },
    {
      accessorKey: 'talElementBrot',
      header: 'talElementBrot',
      enableGlobalFilter: false,
      enableColumnFilter: false,
    },
  ];
  return (
    <div className="sak-list">
      <ResultatKontrollOverviewTable data={resultat} defaultColumns={columns} />
    </div>
  );
};

export default RestultatKontrollOversikt;
