import { ColumnDef, Row } from '@tanstack/react-table';
import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { appRoutes, getFullPath, idPath } from '../../common/appRoutes';
import StatusBadge from '../../common/status-badge/StatusBadge';
import TestlabTable from '../../common/table/TestlabTable';
import UserAction from '../../common/table/user-actions/UserAction';
import { TestResult } from '../../maaling/api/types';

export interface Props {
  maalingId: number;
  testResultList: TestResult[];
  error: any;
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

          if (status !== 'starta' && status !== 'feila') {
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
        accessorFn: (row) => row.loeysing.url,
        id: 'url',
        cell: ({ row }) => <span>{row.original.loeysing.url}</span>,
        header: () => <span>Løsying</span>,
      },
      {
        accessorFn: (row) => row.loeysing.namn,
        id: 'namn',
        cell: (info) => info.getValue(),
        header: () => <span>Verksemd</span>,
      },
      {
        accessorFn: (row) => row.tilstand,
        id: 'status',
        cell: ({ row }) => {
          const status = row.original.tilstand;
          const testSuccess = status === 'ferdig';

          const label = testSuccess ? 'Ferdig' : status;

          return (
            <StatusBadge
              label={label}
              levels={{
                primary: 'starta',
                danger: 'feila',
                success: 'ferdig',
                isSuccess: testSuccess,
              }}
            />
          );
        },
        header: () => <span>Status</span>,
      },
    ],
    []
  );

  return (
    <TestlabTable<TestResult>
      data={testResultList}
      defaultColumns={testColumns}
      fetchError={error}
      filterPreference="searchbar"
    />
  );
};

export default TestingList;
