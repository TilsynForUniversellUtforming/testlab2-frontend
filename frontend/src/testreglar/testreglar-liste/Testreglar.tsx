import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useState } from 'react';
import { Button } from 'react-bootstrap';

import { useEffectOnce } from '../../common/hooks/useEffectOnce';
import useFormatDate from '../../common/hooks/useFormatDate';
import StatusBadge from '../../common/status-badge/StatusBadge';
import DigdirTable from '../../common/table/DigdirTable';
import testreglarApi_dummy from '../api/testreglar-api_dummy';
import { Testregel } from '../api/types';

const testRegelColumns: ColumnDef<Testregel>[] = [
  {
    id: 'Handling',
    cell: () => (
      <Button size="sm" variant="danger">
        &#10005;
      </Button>
    ),
    header: () => <span>Handling</span>,
    enableSorting: false,
  },
  {
    accessorFn: (row) => row.TestregelId,
    id: 'TestregelId',
    cell: (info) => info.getValue(),
    header: () => <span>Testregel</span>,
  },
  {
    accessorFn: (row) => row.Navn,
    id: 'Navn',
    cell: (info) => info.getValue(),
    header: () => <span>Navn</span>,
  },
  {
    accessorFn: (row) => row.Status,
    id: 'Status',
    cell: (info) => (
      <StatusBadge
        title={`${info.getValue()}`}
        levels={{
          primary: 'Publisert',
          danger: 'Utgår',
          success: 'Klar for testing',
        }}
      />
    ),
    header: () => <span>Status</span>,
  },
  {
    accessorFn: (row) => row.Dato_endra,
    id: 'Dato_endra',
    cell: (info) => useFormatDate(String(info.getValue())),
    header: () => <span>Dato Endra</span>,
  },
  {
    accessorFn: (row) => row.Type,
    id: 'Type',
    cell: (info) => info.getValue(),
    header: () => <span>Type</span>,
  },
  {
    accessorFn: (row) => row.Modus,
    id: 'Modus',
    cell: (info) => info.getValue(),
    header: () => <span>Modus</span>,
  },
  {
    accessorFn: (row) => row.Krav,
    id: 'Krav',
    cell: (info) => info.getValue(),
    header: () => <span>Krav</span>,
  },
];

const Testreglar = () => {
  const [testreglar, setTestreglar] = useState<Testregel[]>([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const doFetchTestreglar = useCallback(() => {
    const fetchTestreglar = async () => {
      const data = await testreglarApi_dummy();
      setTestreglar(data);
    };

    setLoading(true);
    setError(undefined);

    fetchTestreglar()
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, []);

  useEffectOnce(() => {
    doFetchTestreglar();
  });

  return (
    <DigdirTable
      data={testreglar}
      defaultColumns={testRegelColumns}
      error={error}
      loading={loading}
      showFilters={false} // TODO - fikse filtere
      onClickRetry={doFetchTestreglar}
    />
  );
};

export default Testreglar;
