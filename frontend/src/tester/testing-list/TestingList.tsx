import { ColumnDef, Row } from '@tanstack/react-table';
import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { appRoutes, getFullPath, idPath } from '../../common/appRoutes';
import { TestlabError } from '../../common/error/ErrorCard';
import StatusBadge from '../../common/status-badge/StatusBadge';
import TestlabTable from '../../common/table/TestlabTable';
import UserAction from '../../common/table/user-actions/UserAction';
import { TestResult } from '../../maaling/api/types';

export interface Props {
  maalingId: number;
  testResultList: TestResult[];
  error?: TestlabError;
}

const TestingList = ({ maalingId, testResultList, error }: Props) => {
  const navigate = useNavigate();

  const onClickEdit = useCallback((row: Row<TestResult>) => {
    const path = getFullPath(
      appRoutes.TEST_RESULT_LIST,
      { pathParam: idPath, id: String(maalingId) },
      {
        pathParam: ':loeysingId',
        id: String(row.original.loeysing.id),
      }
    );

    navigate(path);
  }, []);

  const testColumns = useMemo<ColumnDef<TestResult>[]>(
    () => [
      {
        id: 'Handling',
        cell: ({ row }) => {
          const status = row.original.tilstand;
          const tooltip = `Gå til løysing ${row.original.loeysing.url}`;

          if (status === 'ferdig') {
            return (
              <UserAction<TestResult>
                action={onClickEdit}
                columnUserAction="statistics"
                row={row}
                title={tooltip}
                message="Se testresultat"
              />
            );
          } else {
            return null;
          }
        },
        enableSorting: false,
        size: 1,
      },
      {
        accessorFn: (row) => row.loeysing.namn,
        id: 'url',
        cell: ({ row }) => <>{row.original.loeysing.namn}</>,
        header: () => <>Løysing</>,
      },
      {
        accessorFn: (row) => row.loeysing.namn,
        id: 'namn',
        cell: (info) => info.getValue(),
        header: () => <>Verksemd</>,
      },
      {
        accessorFn: (row) => row.tilstand,
        id: 'status',
        cell: ({ row }) => {
          const status = String(row.original.tilstand);
          const fremgang = row.original.framgang;
          let label: string | undefined = undefined;
          if (status === 'starta' && typeof fremgang !== 'undefined') {
            label = `Tester ${fremgang.prosessert} av ${fremgang.maxLenker}`;
          }

          return (
            <StatusBadge
              status={status}
              customLabel={label}
              levels={{
                primary: ['starta', 'ikkje_starta'],
                danger: ['feila'],
                success: ['ferdig'],
              }}
            />
          );
        },
        header: () => <>Status</>,
      },
    ],
    []
  );

  return (
    <TestlabTable<TestResult>
      data={testResultList}
      defaultColumns={testColumns}
      displayError={error}
      filterPreference="searchbar"
    />
  );
};

export default TestingList;
