import LoadingBar from '@common/loading-bar/LoadingBar';
import { scoreToPercentage } from '@common/table/util';
import { TestlabSeverity } from '@common/types';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { sanitizeEnumLabel } from '@common/util/stringutils';
import { Tag } from '@digdir/designsystemet-react';
import { RESULTAT_KONTROLL } from '@resultat/ResultatRoutes';
import ResultatTable from '@resultat/ResultatTable';
import { Resultat } from '@resultat/types';
import {
  ColumnDef,
  FilterFn,
  Row,
  VisibilityState,
} from '@tanstack/react-table';
import React from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';

const ResultatListApp = () => {
  const resultat: Array<Resultat> = useLoaderData() as Array<Resultat>;
  const navigate = useNavigate();

  const getSeverity = (percentage: number): TestlabSeverity => {
    if (percentage < 60) return 'danger';
    if (percentage < 90) return 'warning';
    return 'success';
  };

  const dateRangeFilter: FilterFn<Resultat> = (
    row: Row<Resultat>,
    columnId: string,
    filterValue: [number, number]
  ) => {
    const [min, max] = filterValue;
    const rowValue = Date.parse(row.getValue('dato'));

    const before = max ? rowValue < max : true;
    const after = min ? rowValue > min : true;

    return before && after;
  };

  const columns: Array<ColumnDef<Resultat>> = [
    {
      accessorKey: 'id',
      header: 'idKontroll',
      enableGlobalFilter: false,
      enableColumnFilter: false,
    },

    {
      accessorKey: 'namn',
      header: 'Saker',
      enableGlobalFilter: false,
      enableColumnFilter: false,
    },

    {
      accessorKey: 'type',
      header: 'Type kontroll',
      cell: ({ row }) => sanitizeEnumLabel(row.original.type),
      filterFn: 'includesString',
    },

    {
      accessorKey: 'dato',
      header: 'dato',
      enableGlobalFilter: false,
      enableColumnFilter: false,
      filterFn: dateRangeFilter,
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
          ariaLabel={`${row.getValue('loeysingNamn')} har resultat på ${row.getValue('progresjon')}`}
        />
      ),
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
      accessorKey: 'testar',
      header: 'Testar',
      enableGlobalFilter: false,
      enableColumnFilter: false,
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
  // eslint-disable-next-line
  const onClickRow = <T extends object>(row?: Row<T>) => {
    const kontrollId = row?.getValue('id');
    const path = getFullPath(RESULTAT_KONTROLL, {
      pathParam: idPath,
      id: String(kontrollId),
    });
    navigate(path);
  };

  const visibilityState = (visDetaljer: boolean): VisibilityState => {
    return {
      talTestaElement: visDetaljer,
      talElementSamsvar: visDetaljer,
      talElementBrot: visDetaljer,
      id: false,
      dato: false,
      type: true,
    };
  };

  return (
    <div className="sak-list">
      <ResultatTable
        data={resultat}
        defaultColumns={columns}
        onClickRow={onClickRow}
        visibilityState={visibilityState}
        topLevelList={true}
        hasFilter={true}
      />
    </div>
  );
};
export default ResultatListApp;
