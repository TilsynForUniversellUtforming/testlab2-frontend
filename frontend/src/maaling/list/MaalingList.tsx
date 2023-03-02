import { ColumnDef, Row } from '@tanstack/react-table';
import React, { useCallback } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';

import AppTitle from '../../common/app-title/AppTitle';
import { appRoutes, getFullPath } from '../../common/appRoutes';
import TestlabLinkButton from '../../common/button/TestlabLinkButton';
import ErrorCard from '../../common/error/ErrorCard';
import StatusBadge from '../../common/status-badge/StatusBadge';
import TestlabTable from '../../common/table/TestlabTable';
import { Maaling } from '../api/types';
import { MaalingContext } from '../types';

const MaalingList = () => {
  const {
    error,
    loading,
    refresh,
    maalingList,
    showMaalinger,
  }: MaalingContext = useOutletContext();

  const navigate = useNavigate();

  const getLink = useCallback((row: Row<Maaling>): string => {
    const maaling = row.original;
    const { id, status } = maaling;
    let path = '';
    if (status === 'planlegging') {
      path = getFullPath(appRoutes.SAK, String(id));
    } else if (status === 'crawling') {
      path = getFullPath(appRoutes.TEST_CRAWLING_LIST, String(id));
    }

    return path;
  }, []);

  const maalingColumns: ColumnDef<Maaling>[] = [
    {
      accessorFn: (row) => row.navn,
      id: 'Navn',
      cell: ({ row, getValue }) => (
        <Link to={`../${getLink(row)}`}>{String(getValue())}</Link>
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
      <AppTitle title="Måling" />
      <TestlabLinkButton type="add" route={appRoutes.MAALING_CREATE} />
      <TestlabTable<Maaling>
        data={maalingList}
        defaultColumns={maalingColumns}
        error={error}
        loading={loading}
        onClickRetry={refresh}
      />
    </>
  );
};

export default MaalingList;
