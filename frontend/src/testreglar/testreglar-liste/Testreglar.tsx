import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useState } from 'react';

import { useEffectOnce } from '../../common/hooks/useEffectOnce';
import DigdirTable from '../../common/table/DigdirTable';
import { Testregel } from '../api/Testregel';
import testreglar_dummy from '../api/testreglar_dummy';
import StatusBadge from './StatusBadge';

const testRegelColumns: ColumnDef<Testregel>[] = [
  {
    accessorFn: (row) => row.TestregelId,
    id: 'TestregelId',
    cell: (info) => info.getValue(),
    header: () => <span>Testregel</span>,
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.Navn,
    id: 'Navn',
    cell: (info) => info.getValue(),
    header: () => <span>Navn</span>,
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.Status,
    id: 'Status',
    cell: (info) => <StatusBadge tittel={`${info.getValue()}`} />,
    header: () => <span>Status</span>,
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.Dato_endra,
    id: 'Dato_endra',
    cell: (info) => info.getValue(),
    header: () => <span>Dato Endra</span>,
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.Type,
    id: 'Type',
    cell: (info) => info.getValue(),
    header: () => <span>Type</span>,
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.Modus,
    id: 'Modus',
    cell: (info) => info.getValue(),
    header: () => <span>Modus</span>,
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.Krav,
    id: 'Krav',
    cell: (info) => info.getValue(),
    header: () => <span>Krav</span>,
    footer: (props) => props.column.id,
  },
];

const Testreglar = () => {
  const [testreglar, setTestreglar] = useState<Testregel[]>([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const doFetchTestreglar = useCallback(() => {
    const fetchTestreglar = async () => {
      const data = await testreglar_dummy();
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
    <>
      <DigdirTable
        data={testreglar}
        defaultColumns={testRegelColumns}
        error={error}
        loading={loading}
        onClickRetry={doFetchTestreglar}
      />
    </>
  );
};

export default Testreglar;
