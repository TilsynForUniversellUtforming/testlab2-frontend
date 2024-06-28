import {
  findTypeKontroll,
  getSeverity,
  scoreToPercentage,
} from '@common/table/util';
import { Tag } from '@digdir/designsystemet-react';
import { fetchResultatPrTemaFilter } from '@resultat/resultat-api';
import ResultatTable from '@resultat/ResultatTable';
import { ResultatTema, TypeKontroll } from '@resultat/types';
import { ColumnDef, VisibilityState } from '@tanstack/react-table';
import React, { useCallback } from 'react';
import { useLoaderData } from 'react-router-dom';

const ResultatListTemaApp = () => {
  const data: Array<ResultatTema> = useLoaderData() as Array<ResultatTema>;

  const [resultat, setResultat] = React.useState<ResultatTema[]>(data);

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

  const getNewResult = useCallback(async (kontrollType?: TypeKontroll) => {
    const newResult = await fetchResultatPrTemaFilter(undefined, kontrollType);
    setResultat(newResult);
  }, []);

  const onSubmitFilter = (value: string) => {
    const kontrollType = findTypeKontroll(value);
    getNewResult(kontrollType);
  };

  return (
    <div className="sak-list">
      <ResultatTable
        data={resultat}
        defaultColumns={columns}
        visibilityState={visibilityState}
        topLevelList={false}
        hasFilter={false}
        onSubmitCallback={onSubmitFilter}
      />
    </div>
  );
};

export default ResultatListTemaApp;
