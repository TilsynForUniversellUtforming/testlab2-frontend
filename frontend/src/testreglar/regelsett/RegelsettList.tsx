import toError from '@common/error/util';
import UserActionTable from '@common/table/UserActionTable';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { joinStringsToList } from '@common/util/stringutils';
import { deleteRegelsettList } from '@testreglar/api/regelsett-api';
import { getRegelsettColumns } from '@testreglar/regelsett/RegelsettCoulmns';
import { REGELSETT_CREATE, REGELSETT_EDIT } from '@testreglar/TestregelRoutes';
import { TestregelContext } from '@testreglar/types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { Regelsett } from '../api/types';

const RegelsettList = () => {
  const {
    contextError,
    contextLoading,
    regelsettList,
    refresh,
    setRegelsettList,
  }: TestregelContext = useOutletContext();
  const navigate = useNavigate();

  const [deleteMessage, setDeleteMessage] = useState<string>('');
  const [regelsettRowSelection, setRegelsettRowSelection] = useState<
    Regelsett[]
  >([]);

  const [error, setError] = useState(contextError);
  const [loading, setLoading] = useState<boolean>(contextLoading);

  useEffect(() => {
    setLoading(contextLoading);
  }, [contextLoading]);

  const regelsettColumns = useMemo(
    () => getRegelsettColumns(),
    [regelsettList]
  );

  const onClickDelete = useCallback(() => {
    setLoading(true);
    setError(undefined);

    if (regelsettRowSelection.length === 0) {
      setError(
        new Error('Kunne ikkje slette regelsett, ingen regelsett valgt')
      );
    }

    const deleteAndFetchRegelsett = async () => {
      try {
        const regelsettIdList = regelsettRowSelection.map((l) => l.id);
        const data = await deleteRegelsettList(regelsettIdList);
        setRegelsettList(data);
      } catch (e) {
        setError(toError(e, 'Kunne ikkje slette regelsett'));
      }
    };

    deleteAndFetchRegelsett().finally(() => {
      setLoading(false);
      setRegelsettRowSelection([]);
    });
  }, [regelsettRowSelection]);

  const onSelectRows = useCallback((rowSelection: Regelsett[]) => {
    setRegelsettRowSelection(rowSelection);

    if (rowSelection.length === 0) {
      setDeleteMessage('');
    } else {
      setDeleteMessage(
        `Vil du sletta ${joinStringsToList(
          rowSelection.map((tr) => `${tr.namn}`)
        )}? Dette kan ikkje angrast`
      );
    }
  }, []);

  const onClickRefresh = useCallback(() => {
    setRegelsettRowSelection([]);
    setError(undefined);
    if (refresh) {
      refresh();
    }
  }, []);

  return (
    <UserActionTable<Regelsett>
      heading="Regelsett"
      subHeading="Liste over alle regelsett"
      tableProps={{
        data: regelsettList,
        defaultColumns: regelsettColumns,
        displayError: {
          onClick: onClickRefresh,
          buttonText: 'Hent på nytt',
          error: error,
        },
        loading: loading,
        onClickRetry: onClickRefresh,
        onSelectRows: onSelectRows,
        rowActions: [
          {
            action: 'add',
            route: REGELSETT_CREATE,
          },
          {
            action: 'delete',
            rowSelectionRequired: true,
            modalProps: {
              title: 'Slett regelsett',
              disabled: regelsettRowSelection.length === 0,
              message: deleteMessage,
              onConfirm: onClickDelete,
            },
          },
        ],
        onClickRow: (row) =>
          navigate(
            getFullPath(REGELSETT_EDIT, {
              pathParam: idPath,
              id: String(row?.original.id),
            })
          ),
      }}
    />
  );
};

export default RegelsettList;
