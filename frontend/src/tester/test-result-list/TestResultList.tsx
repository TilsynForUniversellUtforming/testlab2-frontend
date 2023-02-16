import { ColumnDef } from '@tanstack/react-table';
import React from 'react';

import StatusBadge from '../../common/status-badge/StatusBadge';
import TestlabTable from '../../common/table/TestlabTable';
import { TestResult } from '../api/types';

export interface Props {
  testResult: TestResult[];
  onClickRetry: () => void;
  loading: boolean;
  error: string | undefined;
}

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

const testResultatColumns: ColumnDef<TestResult>[] = [
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
];

const TestResultList = ({
  testResult,
  onClickRetry,
  loading,
  error,
}: Props) => {
  if (!error && !loading && !testResult.length) {
    return null;
  }

  return (
    <TestlabTable<TestResult>
      data={testResult}
      defaultColumns={testResultatColumns}
      error={error}
      loading={loading}
      onClickRetry={onClickRetry}
    />
  );
};

export default TestResultList;
