import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';

import appRoutes, { getFullPath, idPath } from '../../common/appRoutes';
import toError from '../../common/error/util';
import {
  HeaderCheckbox,
  RowCheckbox,
} from '../../common/table/control/toggle/IndeterminateCheckbox';
import UserActionTable from '../../common/table/UserActionTable';
import { deleteLoeysingList } from '../api/loeysing-api';
import { Loeysing } from '../api/types';
import { LoeysingContext } from '../types';

const LoeysingList = () => {
  const {
    loeysingList,
    setLoeysingList,
    contextLoading,
    contextError,
    refresh,
  }: LoeysingContext = useOutletContext();

  const [error, setError] = useState(contextError);
  const [loading, setLoading] = useState(contextLoading);
  const [loeysingRowSelection, setLoeysingRowSelection] = useState<Loeysing[]>(
    []
  );
  const [deleteMessage, setDeleteMessage] = useState<string>('');

  useEffect(() => {
    setLoading(contextLoading);
  }, [contextLoading]);

  const onClickDelete = useCallback(() => {
    setLoading(true);
    setError(undefined);

    if (loeysingRowSelection.length === 0) {
      setError(new Error('Kunne ikkje slette løysing, ingen løysing valgt'));
    }

    const deleteAndFetchLoeysing = async () => {
      try {
        const loeysingIdList = loeysingRowSelection.map((l) => l.id);
        const data = await deleteLoeysingList(loeysingIdList);
        setLoeysingList(data);
      } catch (e) {
        setError(toError(e, 'Kunne ikkje slette løysing'));
      }
    };

    deleteAndFetchLoeysing().finally(() => {
      setLoading(false);
      setLoeysingRowSelection([]);
    });
  }, [loeysingRowSelection]);

  const onSelectRows = useCallback((rowSelection: Loeysing[]) => {
    setLoeysingRowSelection(rowSelection);

    if (rowSelection.length === 0) {
      setDeleteMessage('');
    } else {
      setDeleteMessage(
        `Vil du slette ${rowSelection.map((r) => r.namn).join(',')}`
      );
    }
  }, []);

  const onClickRefresh = useCallback(() => {
    setLoeysingRowSelection([]);
    setError(undefined);
    if (refresh) {
      refresh();
    }
  }, []);

  const loeysingColumns = useMemo<ColumnDef<Loeysing>[]>(
    () => [
      {
        id: 'Handling',
        header: ({ table }) => <HeaderCheckbox table={table} />,
        cell: ({ row }) => <RowCheckbox row={row} />,
        size: 1,
      },
      {
        accessorFn: (row) => row.namn,
        id: 'Navn',
        cell: ({ row, getValue }) => (
          <Link
            to={getFullPath(appRoutes.LOEYSING_EDIT, {
              pathParam: idPath,
              id: String(row.original.id),
            })}
          >
            {String(getValue())}
          </Link>
        ),
        header: () => <span>Namn</span>,
      },
      {
        accessorFn: (row) => row.url,
        id: 'url',
        cell: (info) => info.getValue(),
        header: () => <span>URL</span>,
      },
    ],
    []
  );

  return (
    <UserActionTable<Loeysing>
      heading="Løysingar"
      createRoute={appRoutes.LOEYSING_CREATE}
      tableProps={{
        data: loeysingList,
        defaultColumns: loeysingColumns,
        displayError: { error: error },
        loading: loading,
        onSelectRows: onSelectRows,
        onClickRetry: onClickRefresh,
        rowActions: [
          {
            action: 'delete',
            modalProps: {
              title: 'Slett løysingar',
              disabled: loeysingRowSelection.length === 0,
              message: deleteMessage,
              onConfirm: onClickDelete,
            },
          },
        ],
      }}
    />
  );
};

export default LoeysingList;
