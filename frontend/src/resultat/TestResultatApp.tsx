import ErrorCard from '@common/error/ErrorCard';
import { useEffectOnce } from '@common/hooks/useEffectOnce';
import UserActionTable from '@common/table/UserActionTable';
import { withErrorHandling } from '@common/util/apiUtils';
import { AggregatedTestresult } from '@maaling/api/types';
import { getAggregatedResultColumns } from '@maaling/resultat/testing-list/test-result-list/TestResultColumns';
import React, { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { fetchTestresultatAggregert } from './resultat-api';

const TestResultatApp = () => {
  const { id } = useParams();
  const [testResultList, setTestResultList] = useState<AggregatedTestresult[]>(
    []
  );
  const testResultatColumns = useMemo(() => getAggregatedResultColumns(), []);

  const [error, setError] = useState<Error | undefined>();

  useEffectOnce(() => {
    doFetchTestresultat().then((testresultatAggregert) => {
      setTestResultList(testresultatAggregert);
    });
  });

  const doFetchTestresultat = useCallback(
    withErrorHandling(
      async () => {
        if (id) {
          const testresultatAggregert = await fetchTestresultatAggregert(
            Number(id)
          );

          return testresultatAggregert;
        } else {
          throw new Error('Fant ikkje testresultat med id $id');
        }
      },
      'Kunne ikkje hente måling',
      setError
    ),
    [id]
  );

  if (error) {
    return (
      <ErrorCard
        errorHeader={error.name}
        error={error}
        buttonText={error.name ?? 'Prøv igjen'}
      />
    );
  }

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
