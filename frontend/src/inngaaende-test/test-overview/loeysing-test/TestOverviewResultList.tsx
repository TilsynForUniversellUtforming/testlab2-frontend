import { ResultatManuellKontroll } from '@test/api/types';
import { useTestSession } from '@test/test-overview/hooks/testSessionContext';
import { Table } from '@digdir/designsystemet-react';
import { ColumnDef, VisibilityState } from '@tanstack/react-table';
import { ResultatOversiktLoeysing } from '@resultat/types';
import { TableParams } from '@resultat/ResultatTable';
import { resultTable } from '@resultat/tableoptions';
import React from 'react';
import TestlabTable from '@common/table/TestlabTable';

const TestOverviewResultList = () => {
  const { testResults } = useTestSession();

  const visibilityState = (): VisibilityState => {
    return {};
  };


  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(visibilityState());

  const tableParams: TableParams<ResultatManuellKontroll> = {
    data: testResults,
    defaultColumns: getResultColumns(),
    visibilityState: visibilityState,
  };

  const table = resultTable(
    tableParams.data,
    tableParams.defaultColumns,
    columnVisibility,
    setColumnVisibility
  );

  return (
    <div>
      <h2>Test Overview Result List</h2>
    <TestlabTable
    data={testResults}
    defaultColumns={tableParams.defaultColumns}>
    </TestlabTable>
    </div>
  );
};




export const getResultColumns = (): Array<ColumnDef<ResultatManuellKontroll>> => [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'testregelId',
    header: 'Testregel ID',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'sistLagra',
    header: 'Sist Lagra',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'kommentar',
    header: 'Kommentar',
    cell: (info) => info.getValue() || '-',
  },
  {
    accessorKey: 'testVartUtfoert',
    header: 'Test Utført',
    cell: (info) => info.getValue() || '-',
  },
  {
    accessorKey: 'ekstraSjekk',
    header: 'Ekstra Sjekk',
    cell: (info) => (info.getValue() ? 'Ja' : 'Nei'),
  },
];

interface TestOverviewResultListProps {
  testresultList: ResultatManuellKontroll[];
}

export default TestOverviewResultList;