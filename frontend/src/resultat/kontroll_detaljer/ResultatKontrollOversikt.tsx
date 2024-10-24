import LoadingBar from '@common/loading-bar/LoadingBar';
import { getSeverity, scoreToPercentage } from '@common/table/util';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { sanitizeEnumLabel } from '@common/util/stringutils';
import { Tag } from '@digdir/designsystemet-react';
import { publiserResultat } from '@resultat/resultat-api';
import { TESTRESULTAT_LOEYSING } from '@resultat/ResultatRoutes';
import ResultatTable, {
  TableHeaderParams,
  TableParams,
} from '@resultat/ResultatTable';
import { TableActionsProps } from '@resultat/ResultTableActions';
import { Resultat } from '@resultat/types';
import { ColumnDef, Row, VisibilityState } from '@tanstack/react-table';
import React from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';

const ResultatKontrollOversikt = <T extends object>() => {
  const resultat: Array<Resultat> = useLoaderData() as Array<Resultat>;
  const navigate = useNavigate();
  const { id } = useParams();
  const [publiseringStatus, setPubliseringStatus] = React.useState<boolean>(
    resultat[0].publisert
  );

  console.log('Publiseringsstatus: ' + publiseringStatus);
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
      cell: ({ row }) => (
        <>
          {row.getValue('loeysingNamn')}
          {row.getValue('testType') == 'RETEST' && (
            <Tag color="info">{row.getValue('testType')}</Tag>
          )}
        </>
      ),
    },
    {
      accessorKey: 'testType',
      header: 'Testtype',
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
        <Tag size="small" color={getSeverity(row.getValue('score'))}>
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
  const onClickRow = <T extends object>(row?: Row<T>, subRow?: Row<T>) => {
    const loeysingId = subRow?.getValue('loeysingId');
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

  const visibilityState = (visDetaljer: boolean): VisibilityState => {
    return {
      talTestaElement: visDetaljer,
      talElementSamsvar: visDetaljer,
      talElementBrot: visDetaljer,
      id: false,
      loeysingId: false,
      dato: false,
      type: false,
      testType: false,
    };
  };

  const getTypeKontroll = (): string => {
    const first = resultat[0];
    return sanitizeEnumLabel(first.type);
  };

  const getKontrollNamn = (): string => {
    const first = resultat[0];
    return first.namn;
  };

  const publiserResultatEksternt = () => {
    publiserResultat(Number(id));
    setPubliseringStatus(!publiseringStatus);
  };

  const tableActions: TableActionsProps = {
    actionFunction: publiserResultatEksternt,
    actionsLabel: {
      activate: 'Publiser resultat',
      deactivate: 'Avpubliser resultat',
    },
    isActive: publiseringStatus,
  };

  const tableParams: TableParams<T> = {
    data: resultat as T[],
    defaultColumns: columns,
    onClickRow: onClickRow,
    visibilityState: visibilityState,
  };

  const headerParams: TableHeaderParams = {
    filterParams: { topLevelList: true, hasFilter: false },
    typeKontroll: getTypeKontroll(),
    kontrollNamn: getKontrollNamn(),
    subHeader: getKontrollNamn(),
    reportActions: tableActions,
  };

  return (
    <div className="sak-list">
      <ResultatTable
        tableParams={tableParams}
        headerParams={headerParams}
        rapportButton={true}
      />
    </div>
  );
};

export default ResultatKontrollOversikt;
