import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useState } from 'react';

import DigdirLinkButton from '../../common/button/DigdirLinkButton';
import { useEffectOnce } from '../../common/hooks/useEffectOnce';
import routes from '../../common/routes';
import DigdirTable from '../../common/table/DigdirTable';
import { getRegelsett_dummy } from '../api/testreglar-api_dummy';
import { Testregel, TestRegelsett } from '../api/types';

const Regelsett = () => {
  const [regelsett, setRegelsett] = useState<TestRegelsett[]>([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const doFetchRegelsett = useCallback(() => {
    const fetchRegelsett = async () => {
      const data = await getRegelsett_dummy();
      setRegelsett(data);
    };

    setLoading(true);
    setError(undefined);

    fetchRegelsett()
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, []);

  useEffectOnce(() => {
    doFetchRegelsett();
  });

  const testRegelColumns: ColumnDef<TestRegelsett>[] = [
    {
      accessorFn: (row) => row.namn,
      id: 'Navn',
      cell: (info) => info.getValue(),
      header: () => <span>Navn</span>,
    },
    {
      accessorFn: (row) => row.testreglar,
      id: 'TestregelId',
      cell: (info) => (
        <ul className="testreglar-regelsett__list">
          {(info.getValue() as Testregel[]).map((tr) => (
            <li key={tr.Navn}>{tr.Navn}</li>
          ))}
        </ul>
      ),
      header: () => <span>Testregler</span>,
      enableSorting: false,
    },
  ];

  return (
    <>
      <DigdirLinkButton
        type="add"
        route={routes.NYTT_REGELSETT}
        disabled={loading}
      />
      <DigdirTable
        data={regelsett}
        defaultColumns={testRegelColumns}
        error={error}
        loading={loading}
        customStyle={{ small: true }}
      />
    </>
  );
};

export default Regelsett;
