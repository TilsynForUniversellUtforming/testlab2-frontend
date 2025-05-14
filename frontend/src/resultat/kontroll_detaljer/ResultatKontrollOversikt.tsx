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

function LoeysingNamn(
  props: Readonly<{ loeysingNamn: string; testType: string }>
) {
  return (
    <>
      {props.loeysingNamn}
      {props.testType == 'RETEST' && <Tag color="info">{props.testType}</Tag>}
    </>
  );
}

function Score(props: Readonly<{ score: number }>) {
  return (
    <Tag size="small" color={getSeverity(props.score)}>
      {scoreToPercentage(props.score)}
    </Tag>
  );
}

function Progresjon(
  props: Readonly<{ progresjon: number; loeysingNamn: string }>
) {
  return (
    <LoadingBar
      percentage={props.progresjon}
      ariaLabel={`${props.loeysingNamn} har resultat på ${props.progresjon}`}
    />
  );
}

const ResultatKontrollOversikt = <T extends object>() => {
  const resultat: Array<Resultat> = useLoaderData() as Array<Resultat>;
  const navigate = useNavigate();
  const { id } = useParams();
  const [publiseringStatus, setPubliseringStatus] = React.useState<boolean>(
    resultat[0].publisert
  );

  function getLoeysingNamn(row: Row<Resultat>) {
    return (
      <LoeysingNamn
        loeysingNamn={row.getValue('loeysingNamn')}
        testType={row.getValue('testType')}
      />
    );
  }

  function getProgresjon(row: Row<Resultat>) {
    return (
      <Progresjon
        progresjon={row.getValue('progresjon')}
        loeysingNamn={row.getValue('loeysingNamn')}
      />
    );
  }

  function getScore(row: Row<Resultat>) {
    return <Score score={row.getValue('score')} />;
  }

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
      cell: ({ row }) => getLoeysingNamn(row),
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
      cell: ({ row }) => getProgresjon(row),
    },
    {
      accessorKey: 'score',
      header: 'Resultat',
      enableGlobalFilter: false,
      enableColumnFilter: false,
      cell: ({ row }) => getScore(row),
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

  const tableParams: TableParams<Resultat> = {
    data: resultat,
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
      <ResultatTable tableParams={tableParams} headerParams={headerParams} />
    </div>
  );
};

export default ResultatKontrollOversikt;
