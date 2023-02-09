import { ColumnDef, Row } from '@tanstack/react-table';
import React, { useCallback, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import ConfirmDialog from '../../common/confirm/ConfirmDialog';
import StatusBadge from '../../common/status-badge/StatusBadge';
import DigdirTable from '../../common/table/DigdirTable';
import UserActions, {
  ColumnUserAction,
} from '../../common/table/user-actions/UserActions';
import { deleteTestregel, listTestreglar } from '../api/testreglar-api';
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

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmLabel, setConfirmLabel] = useState<string>();
  const [deleteRow, setDeleteRow] = useState<Row<Testregel>>();

  const onCloseModal = useCallback(() => {
    setShowConfirm(false);
    setDeleteRow(undefined);
  }, []);

  const onClickDelete = useCallback((e: Row<Testregel>) => {
    setShowConfirm(true);
    setConfirmLabel(`Vil du slette testregel "${e.original.kravTilSamsvar}"`);
    setDeleteRow(e);
  }, []);

  const doDelete = useCallback(() => {
    setShowConfirm(false);
    setDeleteRow(undefined);

    if (typeof deleteRow === 'undefined') {
      setError('Kunne ikke slette testregel');
    }

    const deleteAndFetchTestregel = async () => {
      const data = await deleteTestregel(deleteRow!.original.id);
      setTestreglar(data);
    };

    setLoading(true);
    setError(undefined);

    deleteAndFetchTestregel()
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, [deleteRow]);

  const doFetchTestreglar = useCallback(() => {
    const fetchTestreglar = async () => {
      const data = await listTestreglar();
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
      accessorFn: (row) => row.kravTilSamsvar,
      id: 'Navn',
      cell: (info) => info.getValue(),
      header: () => <span>Navn</span>,
    },
    {
      accessorFn: (row) => row.status,
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
      accessorFn: (row) => row.type,
      id: 'Type',
      cell: (info) => info.getValue(),
      header: () => <span>Type</span>,
    },
    {
      accessorFn: (row) => row.referanseAct,
      id: 'TestregelId',
      cell: (info) => info.getValue(),
      header: () => <span>Testregel</span>,
    },
    {
      accessorFn: (row) => row.kravTittel,
      id: 'Krav',
      cell: (info) => info.getValue(),
      header: () => <span>Krav</span>,
    },
  ];

  return (
    <>
      <ConfirmDialog
        label={confirmLabel}
        show={showConfirm}
        closeModal={onCloseModal}
        onSubmit={doDelete}
      />
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
