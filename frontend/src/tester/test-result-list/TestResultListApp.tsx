import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import { useEffectOnce } from '../../common/hooks/useEffectOnce';
import StatusBadge from '../../common/status-badge/StatusBadge';
import TestlabTable from '../../common/table/TestlabTable';
import { TestResult } from '../api/types';
import { TesterContext } from '../types';

const decodeBase64 = (base64String?: string) => {
  if (typeof base64String === 'undefined') {
    return '';
  }

  try {
    return atob(base64String);
  } catch (e) {
    console.log('Feilet decoding av ', base64String);
  }
};

const TestResultListApp = () => {
  const testResultatColumns = React.useMemo<ColumnDef<TestResult>[]>(
    () => [
      {
        accessorFn: (row) => row._idSuksesskriterium,
        id: '_idSuksesskriterium',
        cell: (info) => info.getValue(),
        header: () => <span>Suksesskriterium</span>,
      },
      {
        accessorFn: (row) => row._idTestregel,
        id: '_idTestregel',
        cell: (info) => info.getValue(),
        header: () => <span>Testregel</span>,
      },
      {
        accessorFn: (row) => row._elementUtfall,
        id: '_elementUtfall',
        cell: (info) => (
          <StatusBadge
            label={info.getValue()}
            levels={{
              primary: 'ikkje forekomst',
              danger: 'brot',
              success: 'samsvar',
            }}
          />
        ),
        header: () => <span>Status</span>,
      },
      {
        accessorFn: (row) => row._element.htmlCode,
        id: 'htmlCode',
        cell: (info) => (
          <div style={{ wordWrap: 'break-word' }}>
            {decodeBase64(String(info.getValue()))}
          </div>
        ),
        header: () => <span>HTML element</span>,
      },
      {
        accessorFn: (row) => row._element.pointer,
        id: 'pointer',
        cell: (info) => info.getValue(),
        header: () => <span>Peker</span>,
      },
    ],
    []
  );

  const [testResult, setTestresult] = useState<TestResult[]>([]);

  const { error, loading, setLoading, setContextError }: TesterContext =
    useOutletContext();

  const handleSetTestResult = useCallback((testResult: TestResult[]) => {
    setTestresult(testResult);
  }, []);

  const doFetchLoeysingList = () => {
    console.log('Henter resultat');
  };

  useEffectOnce(() => {
    doFetchLoeysingList();
  });

  if (!error && !loading && !testResult.length) {
    return null;
  }

  return (
    <TestlabTable<TestResult>
      data={testResult}
      defaultColumns={testResultatColumns}
      error={error}
      loading={loading}
      onClickRetry={doFetchLoeysingList}
    />
  );
};

export default TestResultListApp;
