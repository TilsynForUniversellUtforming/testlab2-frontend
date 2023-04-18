import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { appRoutes, getFullPath, idPath } from '../../common/appRoutes';
import ErrorCard from '../../common/error/ErrorCard';
import useFeatureToggles from '../../common/features/hooks/useFeatureToggles';
import { useEffectOnce } from '../../common/hooks/useEffectOnce';
import useFetch from '../../common/hooks/useFetch';
import StatusBadge from '../../common/status-badge/StatusBadge';
import { RowCheckbox } from '../../common/table/control/toggle/IndeterminateCheckbox';
import UserActionTable from '../../common/table/UserActionTable';
import { deleteMaaling, fetchMaalingList } from '../api/maaling-api';
import { Maaling } from '../api/types';

const MaalingList = () => {
  const [error, setError] = useState<string>();
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
      setError('Kunne ikkje slette måling');
    }

    const deleteAndFetchMaaling = async () => {
      const data = await deleteMaaling(maalingRowSelection[0]);
      setMaalingList(data);
    };

    deleteAndFetchMaaling()
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, [maalingRowSelection]);

  const onSelectRows = useCallback((rowSelection: Maaling[]) => {
    setMaalingRowSelection(rowSelection);

    if (rowSelection.length === 0) {
      setDeleteMessage('');
    } else if (rowSelection.length === 1) {
      setDeleteMessage(rowSelection[0].navn);
    } else {
      setError('Flere målinger valgt');
    }
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
      cell: ({ row }) => <RowCheckbox row={row} />,
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
      header: () => <span>Navn</span>,
    },
    {
      accessorFn: (row) => row.status,
      id: 'Status',
      cell: (info) => (
        <StatusBadge
          label={info.getValue()}
          levels={{
            primary: 'crawling',
            danger: 'feilet',
            success: 'ferdig',
          }}
        />
      ),
    },
  ];

  if (!loading && !showMaalinger) {
    return (
      <ErrorCard
        errorText="Målinger låst"
        buttonText="Tilbake"
        onClick={() => navigate('..')}
      />
    );
  }

  return (
    <UserActionTable<Maaling>
      heading="Måling"
      createRoute={appRoutes.SAK_CREATE}
      deleteConfirmationModalProps={{
        title: 'Slett måling',
        disabled: maalingRowSelection.length === 0,
        message: deleteMessage,
        onConfirm: onClickDelete,
      }}
      tableProps={{
        data: maalingList,
        defaultColumns: maalingColumns,
        fetchError: error,
        loading: loading,
        onClickRetry: doFetchMaalingList,
        onSelectRows: onSelectRows,
        disableMultiRowSelection: true,
      }}
    />
  );
};

export default MaalingList;
