import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';

import { appRoutes, getFullPath, idPath } from '../../common/appRoutes';
import ErrorCard from '../../common/error/ErrorCard';
import toError from '../../common/error/util';
import useLoading from '../../common/hooks/useLoading';
import StatusBadge from '../../common/status-badge/StatusBadge';
import { RowCheckbox } from '../../common/table/control/toggle/IndeterminateCheckbox';
import UserActionTable from '../../common/table/UserActionTable';
import { joinStringsToList } from '../../common/util/stringutils';
import { deleteMaalingList } from '../api/maaling-api';
import { IdList, Maaling } from '../api/types';
import { MaalingContext } from '../types';

const MaalingList = () => {
  const {
    maalingList,
    showMaalinger,
    setMaalingList,
    refresh,
    contextError,
    contextLoading,
  }: MaalingContext = useOutletContext();

  const [error, setError] = useState<Error | undefined>(contextError);
  const [loading, setLoading] = useLoading(contextLoading);
  const [maalingRowSelection, setMaalingRowSelection] = useState<Maaling[]>([]);
  const [deleteMessage, setDeleteMessage] = useState<string>('');

  const navigate = useNavigate();

  const onClickDelete = useCallback(() => {
    setMaalingRowSelection([]);
    setLoading(true);
    setError(undefined);

    if (maalingRowSelection.length === 0) {
      setError(new Error('Kunne ikkje slette måling, ingen målingar valgt'));
    }

    const deleteAndFetchMaaling = async () => {
      try {
        const maalingIdList: IdList = {
          idList: maalingRowSelection.map((m) => m.id),
        };
        const data = await deleteMaalingList(maalingIdList);
        setMaalingList(data);
      } catch (e) {
        setError(toError(e, 'Kunne ikkje slette måling'));
      }
    };

    deleteAndFetchMaaling().finally(() => setLoading(false));
  }, [maalingRowSelection]);

  const onSelectRows = useCallback((rowSelection: Maaling[]) => {
    setMaalingRowSelection(rowSelection);
    setDeleteMessage(
      `Vil du sletta ${joinStringsToList(
        rowSelection.map((m) => `"${m.navn}"`)
      )}? Dette kan ikkje angrast`
    );
  }, []);

  const maalingColumns: ColumnDef<Maaling>[] = [
    {
      id: 'Handling',
      cell: ({ row, getValue }) => (
        <RowCheckbox row={row} ariaLabel={`Velg ${row.original.navn}`} />
      ),
      size: 1,
    },
    {
      accessorFn: (row) => row.navn,
      id: 'Namn',
      cell: ({ row, getValue }) => (
        <Link
          to={getFullPath(appRoutes.MAALING, {
            pathParam: idPath,
            id: String(row.original.id),
          })}
        >
          {String(getValue())}
        </Link>
      ),
      header: () => <>Namn</>,
    },
    {
      accessorFn: (row) => row.status,
      id: 'Status',
      cell: (info) => (
        <StatusBadge
          status={info.getValue()}
          levels={{
            primary: ['testing', 'crawling'],
            success: ['testing_ferdig'],
            danger: [],
          }}
        />
      ),
      meta: {
        select: true,
      },
    },
  ];

  if (!loading && !showMaalinger) {
    return (
      <ErrorCard
        errorHeader="Måling"
        error={new Error('Målingar låst')}
        buttonText="Tilbake"
        onClick={() => navigate('..')}
      />
    );
  }

  return (
    <UserActionTable<Maaling>
      heading="Måling"
      actionButtons={[{ route: appRoutes.SAK_CREATE, action: 'add' }]}
      tableProps={{
        data: maalingList,
        defaultColumns: maalingColumns,
        displayError: {
          onClick: refresh,
          buttonText: 'Prøv igjen',
          error: error,
        },
        loading: loading,
        onClickRetry: refresh,
        onSelectRows: onSelectRows,
        rowActions: [
          {
            action: 'delete',
            modalProps: {
              title: 'Slett måling',
              disabled: maalingRowSelection.length === 0,
              message: deleteMessage,
              onConfirm: onClickDelete,
            },
          },
        ],
      }}
    />
  );
};

export default MaalingList;
