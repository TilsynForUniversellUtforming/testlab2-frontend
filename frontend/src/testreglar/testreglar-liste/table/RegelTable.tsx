import React, { useCallback, useState } from 'react';
import Table from 'react-bootstrap/Table';

import { useEffectOnce } from '../../../common/hooks/useEffectOnce';
import Testregel from '../../api/Testregel';
import testreglar_dummy from '../../api/testreglar_dummy';
import TestreglarError from '../error/TestreglarError';
import RegelTableBody from './RegelTableBody';

const RegelTable = () => {
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

  if (error) {
    return <TestreglarError show={error} onClickRetry={doFetchTestreglar} />;
  }

  return (
    <Table striped responsive>
      <thead>
        <tr>
          <th>Regel</th>
          <th>Navn</th>
          <th>Status</th>
          <th>Dato Endra</th>
          <th>Type</th>
          <th>Modus</th>
          <th>Krav</th>
        </tr>
      </thead>
      <tbody>
        <RegelTableBody loading={loading} testreglar={testreglar} />
      </tbody>
    </Table>
  );
};

export default RegelTable;
