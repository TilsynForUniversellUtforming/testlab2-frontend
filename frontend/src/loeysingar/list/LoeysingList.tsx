import toError from '@common/error/util';
import UserActionTable from '@common/table/UserActionTable';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { joinStringsToList } from '@common/util/stringutils';
import { LOEYSING_CREATE, LOEYSING_EDIT } from '@loeysingar/LoeysingRoutes';
import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { deleteLoeysingList } from '../api/loeysing-api';
import { Loeysing } from '../api/types';
import { LoeysingContext } from '../types';
import { getLoeysingColumns } from './LoeysingColumns';

const LoeysingList = () => {
  const {
    loeysingList,
    setLoeysingList,
    contextLoading,
    contextError,
    refresh,
  }: LoeysingContext = useOutletContext();
  const navigate = useNavigate();

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
        `Vil du sletta ${joinStringsToList(
          rowSelection.map((r) => r.namn)
        )}? Dette kan ikkje angrast`
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
    () => getLoeysingColumns(),
    []
  );

  return (
    <UserActionTable<Loeysing>
      heading="Løysingar"
      subHeading="Liste over alle løysingar"
      tableProps={{
        data: loeysingList,
        defaultColumns: loeysingColumns,
        displayError: {
          errorHeader: 'Noko gjekk gale med sletting av løysing',
          error: error,
          buttonText: 'Avbryt',
        },
        loading: loading,
        onSelectRows: onSelectRows,
        onClickRetry: onClickRefresh,
        rowActions: [
          {
            action: 'add',
            route: LOEYSING_CREATE,
          },
          {
            action: 'delete',
            rowSelectionRequired: true,
            modalProps: {
              title: 'Slett løysingar',
              disabled: loeysingRowSelection.length === 0,
              message: deleteMessage,
              onConfirm: onClickDelete,
            },
          },
        ],
        onClickRow: (row) =>
          navigate(
            getFullPath(LOEYSING_EDIT, {
              pathParam: idPath,
              id: String(row?.original.id),
            })
          ),
      }}
    />
  );
};

export default LoeysingList;
