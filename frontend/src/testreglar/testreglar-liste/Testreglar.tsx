import { ColumnDef, Row } from '@tanstack/react-table';
import React, { useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';

import useFormatDate from '../../common/hooks/useFormatDate';
import StatusBadge from '../../common/status-badge/StatusBadge';
import DigdirTable from '../../common/table/DigdirTable';
import UserActions, {
  ColumnUserAction,
} from '../../common/table/user-actions/UserActions';
import {
  deleteTestregel_dummy,
  getTestreglar_dummy,
} from '../api/testreglar-api_dummy';
import { Testregel } from '../api/types';
import { TestregelContext } from '../types';

const Testreglar = () => {
  const {
    error,
    loading,
    testreglar,
    setTestreglar,
    setError,
    setLoading,
  }: TestregelContext = useOutletContext();

  const onClickDelete = useCallback((e: Row<Testregel>) => {
    const fetchTestreglar = async () => {
      const data = await deleteTestregel_dummy(e.original.Id);
      setTestreglar(data);
    };

    setLoading(true);
    setError(undefined);

    fetchTestreglar()
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, []);

  const doFetchTestreglar = useCallback(() => {
    const fetchTestreglar = async () => {
      const data = await getTestreglar_dummy();
      setTestreglar(data);
    };

    setLoading(true);
    setError(undefined);

    fetchTestreglar()
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, []);

  const columnUserAction: ColumnUserAction = { deleteAction: onClickDelete };

  const testRegelColumns: ColumnDef<Testregel>[] = [
    {
      id: 'Handling',
      cell: ({ row }) => <UserActions {...columnUserAction} row={row} />,
      enableSorting: false,
      size: Object.values(columnUserAction).length,
    },
    {
      accessorFn: (row) => row.Navn,
      id: 'Navn',
      cell: (info) => info.getValue(),
      header: () => <span>Navn</span>,
    },
    {
      accessorFn: (row) => row.Status,
      id: 'Status',
      cell: (info) => (
        <StatusBadge
          title={`${info.getValue()}`}
          levels={{
            primary: 'Publisert',
            danger: 'Utgår',
            success: 'Klar for testing',
          }}
        />
      ),
      header: () => <span>Status</span>,
    },
    {
      accessorFn: (row) => row.Dato_endra,
      id: 'Dato_endra',
      cell: (info) => useFormatDate(String(info.getValue())),
      header: () => <span>Dato Endra</span>,
    },
    {
      accessorFn: (row) => row.Type,
      id: 'Type',
      cell: (info) => info.getValue(),
      header: () => <span>Type</span>,
    },
    {
      accessorFn: (row) => row.TestregelId,
      id: 'TestregelId',
      cell: (info) => info.getValue(),
      header: () => <span>Testregel</span>,
    },
    {
      accessorFn: (row) => row.Krav,
      id: 'Krav',
      cell: (info) => info.getValue(),
      header: () => <span>Krav</span>,
    },
  ];

  return (
    <>
      <DigdirTable<Testregel>
        data={testreglar}
        defaultColumns={testRegelColumns}
        error={error}
        loading={loading}
        onClickRetry={doFetchTestreglar}
      />
    </>
  );
};

export default Testreglar;
