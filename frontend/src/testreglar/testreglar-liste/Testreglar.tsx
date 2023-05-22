import { ColumnDef, Row } from '@tanstack/react-table';
import React, { useCallback, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import appRoutes from '../../common/appRoutes';
import EditButton from '../../common/button/EditButton';
import TableActionButton from '../../common/button/TableActionButton';
import ConfirmDialog from '../../common/confirm/ConfirmDialog';
import toError from '../../common/error/util';
import StatusBadge from '../../common/status-badge/StatusBadge';
import TestlabTable from '../../common/table/TestlabTable';
import { deleteTestregel } from '../api/testreglar-api';
import { Testregel } from '../api/types';
import { TestregelContext } from '../types';

const Testreglar = () => {
  const {
    contextError,
    contextLoading,
    testreglar,
    setTestregelList,
    setContextError,
    setContextLoading,
    refresh,
  }: TestregelContext = useOutletContext();

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmLabel, setConfirmLabel] = useState<string>();
  const [deleteRow, setDeleteRow] = useState<Row<Testregel>>();
  const navigate = useNavigate();

  const onClickEdit = useCallback((testregelRow: Row<Testregel>) => {
    navigate(String(testregelRow.original.id));
  }, []);

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
      setContextError(
        new Error('Kunne ikke slette testregel, ingen testregel valgt')
      );
    }

    setContextLoading(true);
    setContextError(undefined);

    const deleteAndFetchTestregel = async () => {
      try {
        const data = await deleteTestregel(deleteRow!.original.id);
        setTestregelList(data);
      } catch (e) {
        setContextError(toError(e, 'Kunne ikkje slette testregel'));
      }
    };

    deleteAndFetchTestregel().finally(() => setContextLoading(false));
  }, [deleteRow]);

  const testRegelColumns: ColumnDef<Testregel>[] = [
    {
      accessorFn: (row) => row.kravTilSamsvar,
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
          status={info.getValue()}
          levels={{
            primary: ['Publisert'],
            danger: ['Utgår'],
            success: ['Klar for testing'],
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
      <TableActionButton
        action="add"
        route={appRoutes.REGELSETT_CREATE}
        disabled={contextLoading || typeof contextError !== 'undefined'}
      />
      <ConfirmDialog
        message={confirmLabel ?? ''}
        show={showConfirm}
        closeModal={onCloseModal}
        onSubmit={doDelete}
      />
      <TestlabTable<Testregel>
        data={testreglar}
        defaultColumns={testRegelColumns}
        displayError={{ error: contextError }}
        loading={contextLoading}
        onClickRetry={refresh}
      />
    </>
  );
};

export default Testreglar;
