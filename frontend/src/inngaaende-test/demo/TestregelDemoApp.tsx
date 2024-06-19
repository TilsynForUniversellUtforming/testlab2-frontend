import '../test.scss';

import { Spinner } from '@digdir/designsystemet-react';
import { ResultatManuellKontroll } from '@test/api/types';
import { TestResultUpdate } from '@test/types';
import { getTestregel } from '@testreglar/api/testreglar-api';
import { Testregel } from '@testreglar/api/types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import TestForm from '../testregel-form/TestForm';

const TestregelDemoApp = () => {
  const [testregel, setTestregel] = useState<Testregel>();
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (!loading && !error && id) {
      setLoading(true);
      const doFetchTestregel = async () => {
        if (id) {
          return await getTestregel(Number(id));
        } else {
          throw new Error('Testregel-id manglar');
        }
      };

      doFetchTestregel()
        .then((testregel) => {
          if (testregel) {
            setTestregel(testregel);
          } else {
            setError('Fann ikkje testregel');
          }
          setLoading(false);
        })
        .catch(() => {
          setError('Kunne ikkje hente data');
        });
    }
  }, [id]);

  const onResultat = (testResultUpdate: TestResultUpdate) => {
    const { resultat, elementOmtale, alleSvar } = testResultUpdate;
    console.info(
      `Resultat: ${JSON.stringify({ resultat, elementOmtale, alleSvar }, null, 2)}`
    );
  };

  if (!testregel || loading) {
    return <Spinner title="Laster" />;
  }

  function slettTestelement() {
    console.info('Du kan ikke slette testelementer i demo appen.');
  }

  return (
    <TestForm
      testregel={testregel}
      resultater={[createResultat(testregel)]}
      onResultat={onResultat}
      slettTestelement={slettTestelement}
      showHelpText={true}
      isLoading={false}
    />
  );
};

export default TestregelDemoApp;

function createResultat(testregel: Testregel): ResultatManuellKontroll {
  return {
    id: 1,
    svar: [],
    status: 'UnderArbeid',
    testgrunnlagId: 1,
    loeysingId: 1,
    testregelId: testregel.id,
    sideutvalId: 1,
    sistLagra: '2024-06-19T10:10:10.100Z',
  };
}
