import toError from '@common/error/util';
import UserActionTable from '@common/table/UserActionTable';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { joinStringsToList } from '@common/util/stringutils';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { deleteTestregelList } from '../api/testreglar-api';
import { Testregel } from '../api/types';
import { TESTREGEL_CREATE, TESTREGEL_EDIT } from '../TestregelRoutes';
import { TestregelContext } from '../types';
import { getTestregelColumns } from './TestregelColumns';

const TestregelList = () => {
  const {
    contextError,
    contextLoading,
    testreglar,
    setTestregelList,
    refresh,
  }: TestregelContext = useOutletContext();
  const navigate = useNavigate();

  const [deleteMessage, setDeleteMessage] = useState<string>('');
  const [testregelRowSelection, setTestregelRowSelection] = useState<
    Testregel[]
  >([]);

  const [error, setError] = useState(contextError);
  const [loading, setLoading] = useState(contextLoading);

  const testRegelColumns = useMemo(() => getTestregelColumns(), []);

  useEffect(() => {
    setLoading(contextLoading);
  }, [contextLoading]);

  const onClickDelete = useCallback(() => {
    setLoading(true);
    setError(undefined);

    if (testregelRowSelection.length === 0) {
      setError(
        new Error('Kunne ikkje slette testregel, ingen testregel valgt')
      );
    }

    const deleteAndFetchTestregel = async () => {
      try {
        const testregelIdList = testregelRowSelection.map((l) => l.id);
        const data = await deleteTestregelList(testregelIdList);
        setTestregelList(data);
      } catch (e) {
        setError(toError(e, 'Kunne ikkje slette testregel'));
      }
    };

    deleteAndFetchTestregel().finally(() => {
      setLoading(false);
      setTestregelRowSelection([]);
    });
  }, [testregelRowSelection]);

  const onSelectRows = useCallback((rowSelection: Testregel[]) => {
    setTestregelRowSelection(rowSelection);

    if (rowSelection.length === 0) {
      setDeleteMessage('');
    } else {
      setDeleteMessage(
        `Vil du sletta ${joinStringsToList(
          rowSelection.map((tr) => `${tr.name}`)
        )}? Dette kan ikkje angrast`
      );
    }
  }, []);

  const onClickRefresh = useCallback(() => {
    setTestregelRowSelection([]);
    setError(undefined);
    if (refresh) {
      refresh();
    }
  }, []);

  return (
    <UserActionTable<Testregel>
      heading="Testreglar"
      subHeading="Liste over alle testreglar"
      tableProps={{
        data: testreglar,
        defaultColumns: testRegelColumns,
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
            route: TESTREGEL_CREATE,
          },
          {
            action: 'delete',
            rowSelectionRequired: true,
            modalProps: {
              title: 'Slett testreglar',
              disabled: testregelRowSelection.length === 0,
              message: deleteMessage,
              onConfirm: onClickDelete,
            },
          },
        ],
        onClickRow: (row) =>
          navigate(
            getFullPath(TESTREGEL_EDIT, {
              pathParam: idPath,
              id: String(row?.original.id),
            })
          ),
      }}
    />
  );
};

export default TestregelList;
