import UserActionTable from '@common/table/UserActionTable';
import { AggregatedTestresult } from '@maaling/api/types';
import { getAggregatedResultColumns } from '@maaling/resultat/testing-list/test-result-list/TestResultColumns';
import React, { useMemo } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';

const TestResultatApp = () => {
  const { id } = useParams();

  const testResultList: AggregatedTestresult[] =
    useLoaderData() as AggregatedTestresult[];
  const testResultatColumns = useMemo(() => getAggregatedResultColumns(), []);

  return (
    <UserActionTable<AggregatedTestresult>
      heading={`Resultat test ${id}`}
      tableProps={{
        data: testResultList ?? [],
        defaultColumns: testResultatColumns,
      }}
    />
  );
};

export default TestResultatApp;
