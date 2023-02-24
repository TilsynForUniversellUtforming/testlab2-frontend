import { ColumnDef, Row } from '@tanstack/react-table';
import React, { useCallback } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { appRoutes, getFullPath } from '../../common/appRoutes';
import EditButton from '../../common/button/EditButton';
import StatusBadge from '../../common/status-badge/StatusBadge';
import TestlabTable from '../../common/table/TestlabTable';
import { Maaling } from '../api/types';
import { MaalingContext } from '../types';

const MaalingList = () => {
  const { error, loading, refresh, maalingList }: MaalingContext =
    useOutletContext();

  const navigate = useNavigate();

  const onClickEdit = useCallback((row: Row<Maaling>) => {
    const maaling = row.original;
    const { id, status } = maaling;
    let path = '/';
    if (status === 'planlegging') {
      path += getFullPath(appRoutes.EDIT_TEST, String(id));
    } else if (status === 'crawling') {
      path += getFullPath(appRoutes.CRAWLING_TEST, String(id));
    }
    navigate(path);
  }, []);

  const maalingColumns: ColumnDef<Maaling>[] = [
    {
      accessorFn: (row) => row.navn,
      id: 'Navn',
      cell: ({ row, getValue }) => (
        <EditButton
          onClick={() => onClickEdit(row)}
          label={String(getValue())}
        />
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

  return (
    <TestlabTable<Maaling>
      data={maalingList}
      defaultColumns={maalingColumns}
      error={error}
      loading={loading}
      onClickRetry={refresh}
    />
  );
};

export default MaalingList;
