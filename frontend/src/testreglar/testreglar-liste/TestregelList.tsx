import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import appRoutes from '../../common/appRoutes';
import toError from '../../common/error/util';
import UserActionTable from '../../common/table/UserActionTable';
import { deleteTestregelList } from '../api/testreglar-api';
import { Testregel } from '../api/types';
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
        `Vil du slette ${rowSelection
          .map((tr) => `${tr.referanseAct} - ${tr.kravTilSamsvar}`)
          .join(',')}`
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
      actionButtons={[{ route: appRoutes.TESTREGEL_CREATE, action: 'add' }]}
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
            action: 'delete',
            modalProps: {
              title: 'Slett testreglar',
              disabled: testregelRowSelection.length === 0,
              message: deleteMessage,
              onConfirm: onClickDelete,
            },
          },
        ],
      }}
    />
  );
};

export default TestregelList;
