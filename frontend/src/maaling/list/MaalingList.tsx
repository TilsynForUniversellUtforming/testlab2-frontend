import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { appRoutes, getFullPath, idPath } from '../../common/appRoutes';
import ErrorCard from '../../common/error/ErrorCard';
import toError from '../../common/error/util';
import useFeatureToggles from '../../common/features/hooks/useFeatureToggles';
import { useEffectOnce } from '../../common/hooks/useEffectOnce';
import useFetch from '../../common/hooks/useFetch';
import StatusBadge from '../../common/status-badge/StatusBadge';
import { RowCheckbox } from '../../common/table/control/toggle/IndeterminateCheckbox';
import UserActionTable from '../../common/table/UserActionTable';
import { joinStringsToList } from '../../common/util/stringutils';
import { deleteMaalingList, fetchMaalingList } from '../api/maaling-api';
import { IdList, Maaling } from '../api/types';

const MaalingList = () => {
  const [error, setError] = useState<Error | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [maalingList, setMaalingList] = useState<Maaling[]>([]);
  const [showMaalinger, setShowMaalinger] = useState(false);
  const [maalingRowSelection, setMaalingRowSelection] = useState<Maaling[]>([]);
  const [deleteMessage, setDeleteMessage] = useState<string>('');

  const navigate = useNavigate();

  const doFetchMaalingList = useFetch<Maaling[]>({
    fetchData: fetchMaalingList,
    setData: setMaalingList,
    setError: setError,
    setLoading: setLoading,
  });

  const onClickDelete = useCallback(() => {
    setMaalingRowSelection([]);
    setLoading(true);
    setError(undefined);

    if (maalingRowSelection.length === 0) {
      setError(new Error('Kunne ikkje slette måling, ingen målinger valgt'));
    }

    const deleteAndFetchMaaling = async () => {
      try {
        const maalingIdList: IdList = {
          idList: maalingRowSelection.map((m) => m.id),
        };
        const data = await deleteMaalingList(maalingIdList);
        setMaalingList(data);
      } catch (e) {
        setError(toError(e, 'Kunne ikkje slette måling'));
      }
    };

    deleteAndFetchMaaling().finally(() => setLoading(false));
  }, [maalingRowSelection]);

  const onSelectRows = useCallback((rowSelection: Maaling[]) => {
    setMaalingRowSelection(rowSelection);
    setDeleteMessage(
      `Vil du slette ${joinStringsToList(
        rowSelection.map((m) => `"${m.navn}"`)
      )}? Dette kan ikkje angrast`
    );
  }, []);

  const handleInitMaalinger = () => {
    doFetchMaalingList();
    setShowMaalinger(true);
  };

  useEffectOnce(() => {
    useFeatureToggles('maalinger', handleInitMaalinger, setLoading);
  });

  const maalingColumns: ColumnDef<Maaling>[] = [
    {
      id: 'Handling',
      cell: ({ row, getValue }) => (
        <RowCheckbox row={row} ariaLabel={`Velg ${row.original.navn}`} />
      ),
      size: 1,
    },
    {
      accessorFn: (row) => row.navn,
      id: 'Navn',
      cell: ({ row, getValue }) => (
        <Link
          to={getFullPath(appRoutes.MAALING, {
            pathParam: idPath,
            id: String(row.original.id),
          })}
        >
          {String(getValue())}
        </Link>
      ),
      header: () => <>Navn</>,
    },
    {
      accessorFn: (row) => row.status,
      id: 'Status',
      cell: (info) => (
        <StatusBadge
          status={info.getValue()}
          levels={{
            primary: ['testing', 'crawling'],
            success: ['testing_ferdig'],
            danger: [],
          }}
        />
      ),
      meta: {
        select: true,
      },
    },
  ];

  if (!loading && !showMaalinger) {
    return (
      <ErrorCard
        errorHeader="Måling"
        error={new Error('Målinger låst')}
        buttonText="Tilbake"
        onClick={() => navigate('..')}
      />
    );
  }

  return (
    <UserActionTable<Maaling>
      heading="Måling"
      actionButtons={[{ route: appRoutes.SAK_CREATE, action: 'add' }]}
      tableProps={{
        data: maalingList,
        defaultColumns: maalingColumns,
        displayError: {
          onClick: doFetchMaalingList,
          buttonText: 'Prøv igjen',
          error: error,
        },
        loading: loading,
        onClickRetry: doFetchMaalingList,
        onSelectRows: onSelectRows,
        rowActions: [
          {
            action: 'delete',
            modalProps: {
              title: 'Slett måling',
              disabled: maalingRowSelection.length === 0,
              message: deleteMessage,
              onConfirm: onClickDelete,
            },
          },
        ],
      }}
    />
  );
};

export default MaalingList;
