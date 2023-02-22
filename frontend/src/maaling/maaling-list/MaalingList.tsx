import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { useOutletContext } from 'react-router-dom';

import StatusBadge from '../../common/status-badge/StatusBadge';
import TestlabTable from '../../common/table/TestlabTable';
import { Maaling } from '../api/types';
import { MaalingContext } from '../types';

const MaalingList = () => {
  const { error, loading, refresh, maalingList }: MaalingContext =
    useOutletContext();

  const maalingColumns: ColumnDef<Maaling>[] = [
    { id: 'Navn', accessorFn: (row) => row.navn },
    {
      accessorFn: (row) => row.status,
      id: 'Status',
      cell: (info) => <StatusBadge label={info.getValue()} />,
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
