import { ColumnDef, Row } from '@tanstack/react-table';
import React, { useCallback, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';

import DigdirLinkButton from '../../common/button/DigdirLinkButton';
import ConfirmDialog from '../../common/confirm/ConfirmDialog';
import routes from '../../common/routes';
import DigdirTable from '../../common/table/DigdirTable';
import UserActions, {
  ColumnUserAction,
} from '../../common/table/user-actions/UserActions';
import { deleteRegelsett } from '../api/testreglar-api';
import { TestRegelsett } from '../api/types';
import { TestregelContext } from '../types';

const Regelsett = () => {
  const {
    error,
    loading,
    regelsett,
    setError,
    setLoading,
    setRegelsettList,
  }: TestregelContext = useOutletContext();

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
      setError('Kunne ikke slette testregel');
    }

    const deleteAndFetchRegelsett = async () => {
      const data = await deleteRegelsett(deleteRow!.original.id);
      setRegelsettList(data);
    };

    setLoading(true);
    setError(undefined);

    deleteAndFetchRegelsett()
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, [deleteRow]);

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
      cell: (info) => info.getValue(),
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
      <DigdirLinkButton
        type="add"
        route={routes.CREATE_REGELSETT}
        disabled={loading || error}
      />
      <DigdirTable<TestRegelsett>
        data={regelsett}
        defaultColumns={testRegelColumns}
        error={error}
        loading={loading}
        customStyle={{ small: true }}
      />
    </>
  );
};

export default Regelsett;
