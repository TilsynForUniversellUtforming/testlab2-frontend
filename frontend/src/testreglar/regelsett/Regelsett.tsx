import { ColumnDef, Row } from '@tanstack/react-table';
import React, { useCallback, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { useNavigate, useOutletContext } from 'react-router-dom';

import appRoutes from '../../common/appRoutes';
import EditButton from '../../common/button/EditButton';
import TestlabLinkButton from '../../common/button/TestlabLinkButton';
import ConfirmDialog from '../../common/confirm/ConfirmDialog';
import TestlabTable from '../../common/table/TestlabTable';
import UserActions, {
  ColumnUserAction,
} from '../../common/table/user-actions/UserActions';
import { deleteRegelsett } from '../api/testreglar-api';
import { TestRegelsett } from '../api/types';
import { TestregelContext } from '../types';

const Regelsett = () => {
  const {
    contextError,
    contextLoading,
    regelsett,
    setContextError,
    setContextLoading,
    setRegelsettList,
  }: TestregelContext = useOutletContext();
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmLabel, setConfirmLabel] = useState<string>();
  const [deleteRow, setDeleteRow] = useState<Row<TestRegelsett>>();

  const onCloseModal = useCallback(() => {
    setShowConfirm(false);
    setDeleteRow(undefined);
  }, []);

  const onClickDelete = useCallback((e: Row<TestRegelsett>) => {
    setShowConfirm(true);
    setConfirmLabel(`Vil du slette regelsett "${e.original.namn}"`);
    setDeleteRow(e);
  }, []);

  const doDelete = useCallback(() => {
    setShowConfirm(false);
    setDeleteRow(undefined);

    if (typeof deleteRow === 'undefined') {
      setContextError('Kunne ikke slette testregel');
    }

    const deleteAndFetchRegelsett = async () => {
      const data = await deleteRegelsett(deleteRow!.original.id);
      setRegelsettList(data);
    };

    setContextLoading(true);
    setContextError(undefined);

    deleteAndFetchRegelsett()
      .catch((e) => setContextError(e))
      .finally(() => setContextLoading(false));
  }, [deleteRow]);

  const onClickEdit = useCallback((regelsettRow: Row<TestRegelsett>) => {
    navigate(String(regelsettRow.original.id));
  }, []);

  const columnUserAction: ColumnUserAction = { deleteAction: onClickDelete };

  const testRegelColumns: ColumnDef<TestRegelsett>[] = [
    {
      id: 'Handling',
      cell: ({ row }) => <UserActions {...columnUserAction} row={row} />,
      enableSorting: false,
      size: Object.values(columnUserAction).length,
    },
    {
      accessorFn: (row) => row.namn,
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
      accessorFn: (row) =>
        row.testregelList.map((tr) => tr.kravTilSamsvar).join(','),
      id: 'TestregelId',
      cell: ({ row }) => (
        <ListGroup className="testreglar-regelsett__list" as="ol" numbered>
          {row.original.testregelList.map((tr) => (
            <ListGroup.Item key={tr.id} as="li">
              {tr.kravTilSamsvar}
            </ListGroup.Item>
          ))}
        </ListGroup>
      ),
      header: () => <span>Testregler</span>,
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
      <TestlabLinkButton
        type="add"
        route={appRoutes.REGELSETT_CREATE}
        disabled={contextLoading || contextError}
      />
      <TestlabTable<TestRegelsett>
        data={regelsett}
        defaultColumns={testRegelColumns}
        error={contextError}
        loading={contextLoading}
        customStyle={{ small: true }}
      />
    </>
  );
};

export default Regelsett;
