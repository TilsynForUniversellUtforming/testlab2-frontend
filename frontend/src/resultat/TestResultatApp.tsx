import ErrorCard from '@common/error/ErrorCard';
import { useEffectOnce } from '@common/hooks/useEffectOnce';
import { withErrorHandling } from '@common/util/apiUtils';
import { AggregatedTestresult } from '@maaling/api/types';
import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

import { fetchTestresultatAggregert } from './resultat-api';

const TestResultatApp = () => {
  const { id } = useParams();
  const [testResultList, setTestResultList] = useState<AggregatedTestresult[]>(
    []
  );
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

          return testresultatAggregert.aggregatedResultList;
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
    <div>
      <ul>
        {testResultList.map((testResult) => (
          <li key={testResult.testregelId}>{testResult.compliancePercent}</li>
        ))}
      </ul>
    </div>
  );
};

export default TestResultatApp;
