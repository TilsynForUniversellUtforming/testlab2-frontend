import LoadingBar from '@common/loading-bar/LoadingBar';
import { getSeverity } from '@common/table/util';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { Tag } from '@digdir/designsystemet-react';
import ResultatKontrollOverviewTable from '@resultat/kontroll_detaljer/ResultatKontrollOverviewTable';
import { TESTRESULTAT_LOEYSING } from '@resultat/ResultatRoutes';
import { Resultat } from '@resultat/types';
import { ColumnDef, Row } from '@tanstack/react-table';
import React from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';

const RestultatKontrollOversikt = () => {
  const resultat: Array<Resultat> = useLoaderData() as Array<Resultat>;
  const navigate = useNavigate();
  const { id } = useParams();

  const columns: Array<ColumnDef<Resultat>> = [
    {
      accessorKey: 'loeysingId',
      header: 'idLoeysing',
      enableGlobalFilter: false,
      enableColumnFilter: false,
    },
    {
      accessorKey: 'verksemdNamn',
      header: 'Verksemder',
      enableGlobalFilter: false,
      enableColumnFilter: false,
    },

    {
      accessorKey: 'loeysingNamn',
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

  // eslint-disable-next-line
  const onClickRow = <T extends object>(row: Row<T>, subRow: Row<T>) => {
    const loeysingId = subRow.getValue('loeysingId');
    const path = getFullPath(
      TESTRESULTAT_LOEYSING,
      {
        pathParam: idPath,
        id: String(id),
      },
      {
        pathParam: ':loeysingId',
        id: String(loeysingId),
      }
    );
    navigate(path);
  };

  return (
    <div className="sak-list">
      <ResultatKontrollOverviewTable
        data={resultat}
        defaultColumns={columns}
        onClickRow={onClickRow}
      />
    </div>
  );
};

export default RestultatKontrollOversikt;
