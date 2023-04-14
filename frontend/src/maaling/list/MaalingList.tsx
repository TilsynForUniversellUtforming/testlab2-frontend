import './maaling-list.scss';

import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AppTitle from '../../common/app-title/AppTitle';
import { appRoutes, getFullPath, idPath } from '../../common/appRoutes';
import TestlabLinkButton from '../../common/button/TestlabLinkButton';
import ConfirmModalButton from '../../common/confirm/ConfirmModalButton';
import ErrorCard from '../../common/error/ErrorCard';
import useFeatureToggles from '../../common/features/hooks/useFeatureToggles';
import { useEffectOnce } from '../../common/hooks/useEffectOnce';
import useFetch from '../../common/hooks/useFetch';
import StatusBadge from '../../common/status-badge/StatusBadge';
import { RowCheckbox } from '../../common/table/control/toggle/IndeterminateCheckbox';
import TestlabTable from '../../common/table/TestlabTable';
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
      setError('Kunne ikke slette testregel');
    }

    const deleteAndFetchTestregel = async () => {
      const data = await deleteMaaling(maalingRowSelection[0]);
      setMaalingList(data);
    };

    deleteAndFetchTestregel()
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
    <div className="maaling-list">
      <AppTitle heading="Måling" />
      <div className="maaling-list__user-actions">
        <div className="maaling-list__action">
          <TestlabLinkButton type="add" route={appRoutes.SAK_CREATE} />
        </div>
        <div className="maaling-list__action">
          <ConfirmModalButton
            title="Slett måling"
            disabled={maalingRowSelection.length === 0}
            message={deleteMessage}
            onConfirm={onClickDelete}
          />
        </div>
      </div>
      <TestlabTable<Maaling>
        data={maalingList}
        defaultColumns={maalingColumns}
        fetchError={error}
        loading={loading}
        onClickRetry={doFetchMaalingList}
        onSelectRows={onSelectRows}
        disableMultiRowSelection
      />
    </div>
  );
};

export default MaalingList;
