import { getSeverity, scoreToPercentage } from '@common/table/util';
import { Tag } from '@digdir/designsystemet-react';
import { fetchResultatPrTemaFilter } from '@resultat/resultat-api';
import ResultatTable, {
  TableHeaderParams,
  TableParams,
} from '@resultat/ResultatTable';
import { ResultatTema } from '@resultat/types';
import { ColumnDef, VisibilityState } from '@tanstack/react-table';
import React, { useCallback } from 'react';
import { useLoaderData } from 'react-router-dom';

import { KontrollType } from '../../kontroll/types';

const ResultatListTemaApp = <T extends object>() => {
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
          {row.getValue('score')}
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

  const getNewResult = useCallback(
    async (
      kontrollId?: number,
      kontrollType?: KontrollType,
      fraDato?: string,
      tilDato?: string
    ) => {
      const newResult = await fetchResultatPrTemaFilter(
        undefined,
        kontrollType,
        fraDato,
        tilDato
      );
      setResultat(newResult);
    },
    []
  );

  const onSubmitFilter = (
    kontrollId?: number,
    kontrollType?: KontrollType,
    fraDato?: Date,
    tilDato?: Date
  ) => {
    getNewResult(
      kontrollId,
      kontrollType,
      fraDato?.toISOString().split('T')?.[0],
      tilDato?.toISOString().split('T')?.[0]
    );
  };

  const tableParams: TableParams<T> = {
    data: resultat as T[],
    defaultColumns: columns,
    onClickRow: undefined,
    visibilityState: visibilityState,
  };

  const headerParams: TableHeaderParams = {
    filterParams: { topLevelList: false, hasFilter: false },
  };

  return (
    <div className="sak-list">
      <ResultatTable
        tableParams={tableParams}
        headerParams={headerParams}
        onSubmitCallback={onSubmitFilter}
      />
    </div>
  );
};

export default ResultatListTemaApp;
