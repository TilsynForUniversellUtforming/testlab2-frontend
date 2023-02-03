import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useState } from 'react';

import { useEffectOnce } from '../../common/hooks/useEffectOnce';
import DigdirTable from '../../common/table/DigdirTable';
import { getRegelsett_dummy } from '../api/testreglar-api_dummy';
import { Testregel, TestRegelsett } from '../api/types';

const Regelsett = () => {
  const [regelsett, setRegelsett] = useState<TestRegelsett[]>([]);
  // const [selectedRegelsett, setSelectedRegelsett] = useState<TestRegelsett>();
  // const [options, setOptions] = useState<SelectOption[]>([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const doFetchRegelsett = useCallback(() => {
    const fetchRegelsett = async () => {
      const data = await getRegelsett_dummy();
      setRegelsett(data);
      // const options: SelectOption[] = data.map((tr) => ({
      //   label: tr.namn,
      //   value: tr.namn,
      // }));
      //
      // setOptions(options);

      // const defaultRegelsett = data.find((rs) => rs.namn === DEFAULT_REGELSETT);
      // setSelectedRegelsett(defaultRegelsett);
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

  // const onChangeRegelsett = useCallback(
  //   (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const selected = regelsett.find((rs) => rs.namn === e.target.value);
  //     setSelectedRegelsett(selected);
  //   },
  //   [regelsett]
  // );

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
        <ul>
          {(info.getValue() as Testregel[]).map((tr) => (
            <li key={tr.Navn}>{tr.Navn}</li>
          ))}
        </ul>
      ),
      header: () => <span>Testregler</span>,
    },
  ];

  return (
    <DigdirTable
      data={regelsett}
      defaultColumns={testRegelColumns}
      error={error}
      loading={loading}
      customStyle={{ small: true }}
    />
  );
};

export default Regelsett;
