import { ResultatManuellKontroll } from '@test/api/types';
import { useTestSession } from '@test/test-overview/hooks/testSessionContext';
import { Table } from '@digdir/designsystemet-react';
import {
  ColumnDef,
  createColumnHelper,
  VisibilityState,
} from '@tanstack/react-table';
import { ResultatOversiktLoeysing } from '@resultat/types';
import { TableParams } from '@resultat/ResultatTable';
import { resultTable } from '@resultat/tableoptions';
import React from 'react';
import TestlabTable from '@common/table/TestlabTable';
import styles from './testform-results.module.scss';


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
    <div className={styles.testFormResults}>
    <TestlabTable
    data={testResults}
    defaultColumns={tableParams.defaultColumns}>
    </TestlabTable>
    </div>
  );
};


const columnHelper = createColumnHelper<ResultatManuellKontroll>();


export const getResultColumns = (): Array<ColumnDef<ResultatManuellKontroll>> => [
  {
    id: 'nr',
    header: 'NR',
    cell: (info) => `${info.row.original.testregelId} ${info.row.index + 1}`,
  },
  {
    accessorKey: 'sideutvalId',
    header: 'Side',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'element.elementOmtale',
    header: 'Element',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'element.elementResultat',
    header: 'Utfall',
    cell: (info) => info.getValue() || '-',
  },
  {
    accessorKey: 'kommentar',
    header: 'Kommentar',
    cell: (info) => info.getValue() || '-',
  },
  {
    accessorKey: 'sistLagra',
    header: 'Sist endret',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'ekstraSjekk',
    header: 'Flagget',
    cell: (info) => info.getValue(),
  },
];

interface TestOverviewResultListProps {
  testresultList: ResultatManuellKontroll[];
}

export default TestOverviewResultList;