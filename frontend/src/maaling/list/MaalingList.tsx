import { ColumnDef } from '@tanstack/react-table';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AppTitle from '../../common/app-title/AppTitle';
import { appRoutes, getFullPath, idPath } from '../../common/appRoutes';
import TestlabLinkButton from '../../common/button/TestlabLinkButton';
import ErrorCard from '../../common/error/ErrorCard';
import useFeatureToggles from '../../common/features/hooks/useFeatureToggles';
import { useEffectOnce } from '../../common/hooks/useEffectOnce';
import useFetch from '../../common/hooks/useFetch';
import StatusBadge from '../../common/status-badge/StatusBadge';
import TestlabTable from '../../common/table/TestlabTable';
import { fetchMaalingList } from '../api/maaling-api';
import { Maaling } from '../api/types';

const MaalingList = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [maalingList, setMaalingList] = useState<Maaling[]>([]);
  const [showMaalinger, setShowMaalinger] = useState(false);

  const navigate = useNavigate();

  const doFetchMaalingList = useFetch<Maaling[]>({
    fetchData: fetchMaalingList,
    setData: setMaalingList,
    setError: setError,
    setLoading: setLoading,
  });

  const handleInitMaalinger = () => {
    doFetchMaalingList();
    setShowMaalinger(true);
  };

  useEffectOnce(() => {
    useFeatureToggles('maalinger', handleInitMaalinger, setLoading);
  });

  const maalingColumns: ColumnDef<Maaling>[] = [
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
    <>
      <AppTitle heading="Måling" />
      <TestlabLinkButton type="add" route={appRoutes.SAK_CREATE} />
      <TestlabTable<Maaling>
        data={maalingList}
        defaultColumns={maalingColumns}
        fetchError={error}
        loading={loading}
        onClickRetry={doFetchMaalingList}
      />
    </>
  );
};

export default MaalingList;
