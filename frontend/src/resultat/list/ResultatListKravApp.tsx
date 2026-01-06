import { getSeverity, scoreToPercentage } from '@common/table/util';
import { Tag } from '@digdir/designsystemet-react';
import { fetchResultatPrKravFilter } from '@resultat/resultat-api';
import ResultatTable, {
  TableHeaderParams,
  TableParams,
} from '@resultat/ResultatTable';
import { ResultatKrav } from '@resultat/types';
import { ColumnDef, Row, VisibilityState } from '@tanstack/react-table';
import React, { useCallback } from 'react';
import { useLoaderData } from 'react-router-dom';

import { KontrollType } from '../../kontroll/types';

const ResultatListKravApp = <T extends object>() => {
  const data: Array<ResultatKrav> = useLoaderData() as Array<ResultatKrav>;

  const [resultat, setResultat] = React.useState<ResultatKrav[]>(data);

  const columns: Array<ColumnDef<ResultatKrav>> = [
    {
      accessorKey: 'suksesskriterium',
      header: 'Krav',
      enableGlobalFilter: false,
      enableColumnFilter: false,
    },
    {
      accessorKey: 'score',
      header: 'Resultat',
      enableGlobalFilter: false,
      enableColumnFilter: false,
      cell: ({ row }) => getScoreTag(row)
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

  const visibilityStateResultTables = (): VisibilityState => {
    return {};
  };

  const getNewResult = useCallback(
    async (
      kontrollId?: number,
      kontrollType?: KontrollType,
      fraDato?: string,
      tilDato?: string
    ) => {
      const newResult = await fetchResultatPrKravFilter(
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
    visibilityState: visibilityStateResultTables,
  };

  const headerParams: TableHeaderParams = {
    filterParams: { topLevelList: false, hasFilter: false },
  };

  function getScoreTag(row: Row<ResultatKrav>) {
    return <ScoreTag row={row} />;
  }



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

function ScoreTag(props: Readonly<{ row: Row<ResultatKrav> }>) {
  return (
    <Tag
      data-size="sm"
      data-color={getSeverity(scoreToPercentage(props.row.getValue('score')))}
    >
      {props.row.getValue('score')}
    </Tag>
  );
}

export default ResultatListKravApp;
