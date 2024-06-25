import { getSeverity, scoreToPercentage } from '@common/table/util';
import { Tag } from '@digdir/designsystemet-react';
import ResultatTable from '@resultat/ResultatTable';
import { ResultatTema } from '@resultat/types';
import { ColumnDef, VisibilityState } from '@tanstack/react-table';
import React from 'react';
import { useLoaderData } from 'react-router-dom';

const ResultatListTemaApp = () => {
  const data: Array<ResultatTema> = useLoaderData() as Array<ResultatTema>;

  const columns: Array<ColumnDef<ResultatTema>> = [
    {
      accessorKey: 'temaNamn',
      header: 'Tema',
      enableGlobalFilter: false,
      enableColumnFilter: false,
    },
    {
      accessorKey: 'score',
      header: 'Resultat',
      enableGlobalFilter: false,
      enableColumnFilter: false,
      cell: ({ row }) => (
        <Tag
          size="small"
          color={getSeverity(scoreToPercentage(row.getValue('score')))}
        >
          {scoreToPercentage(row.getValue('score'))}
        </Tag>
      ),
    },
    {
      accessorKey: 'talTestaElement',
      header: 'Tal testa element',
      enableGlobalFilter: false,
      enableColumnFilter: false,
    },

    {
      accessorKey: 'talElementSamsvar',
      header: 'Tal samsvar',
      enableGlobalFilter: false,
      enableColumnFilter: false,
    },
    {
      accessorKey: 'talElementBrot',
      header: 'Tal brot',
      enableGlobalFilter: false,
      enableColumnFilter: false,
    },
  ];

  const visibilityState = (): VisibilityState => {
    return {};
  };

  const onChangeFilter = (value: string) => {
    console.log('On change' + value);
  };

  return (
    <div className="sak-list">
      <ResultatTable
        data={data}
        defaultColumns={columns}
        visibilityState={visibilityState}
        topLevelList={false}
        hasFilter={false}
        onSubmitCallback={onChangeFilter}
      />
    </div>
  );
};

export default ResultatListTemaApp;
