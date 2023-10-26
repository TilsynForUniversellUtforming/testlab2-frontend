import toError from '@common/error/util';
import useError from '@common/hooks/useError';
import useLoading from '@common/hooks/useLoading';
import StatusBadge from '@common/status-badge/StatusBadge';
import { getCheckboxColumn } from '@common/table/control/toggle/CheckboxColumn';
import UserActionTable from '@common/table/UserActionTable';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { formatDateString, joinStringsToList } from '@common/util/stringutils';
import { MAALING } from '@maaling/MaalingRoutes';
import { SAK_CREATE } from '@sak/SakRoutes';
import { ColumnDef, Row } from '@tanstack/react-table';
import React, { useCallback, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { deleteMaalingList } from '../api/maaling-api';
import { IdList, Maaling, MaalingStatus } from '../api/types';
import { MaalingContext } from '../types';

const MaalingList = () => {
  const {
    maalingList,
    setMaalingList,
    refresh,
    contextError,
    contextLoading,
  }: MaalingContext = useOutletContext();

  const [error, setError] = useError(contextError);
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
    getCheckboxColumn((row: Row<Maaling>) => `Velg ${row.original.navn}`),
    {
      accessorFn: (row) => row.navn,
      id: 'Namn',
      cell: ({ getValue }) => getValue(),
      header: () => <>Namn</>,
    },
    {
      accessorFn: (row) => row.datoStart,
      id: 'Dato start',
      cell: ({ getValue }) => formatDateString(String(getValue())),
      header: () => <>Dato start</>,
    },
    {
      accessorFn: (row) => row.status,
      id: 'Status',
      cell: (info) => (
        <StatusBadge<MaalingStatus>
          status={String(info.getValue())}
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
      filterFn: 'exact',
    },
  ];

  return (
    <UserActionTable<Maaling>
      heading="Målingar"
      subHeading="Liste over alle målingar"
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
            action: 'add',
            route: SAK_CREATE,
          },
          {
            action: 'delete',
            rowSelectionRequired: true,
            modalProps: {
              title: 'Slett måling',
              disabled: maalingRowSelection.length === 0,
              message: deleteMessage,
              onConfirm: onClickDelete,
            },
          },
        ],
        onClickRow: (row) =>
          navigate(
            getFullPath(MAALING, {
              pathParam: idPath,
              id: String(row?.original.id),
            })
          ),
      }}
    />
  );
};

export default MaalingList;
