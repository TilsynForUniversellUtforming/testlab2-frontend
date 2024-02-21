import '../test.scss';

import { Spinner } from '@digdir/design-system-react';
import { ResultatManuellKontroll, Svar } from '@test/api/types';
import { getTestregel } from '@testreglar/api/testreglar-api';
import { Testregel } from '@testreglar/api/types';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import TestForm from '../testregel-form/TestForm';
import { TestregelResultat } from '../util/testregelParser';

const TestregelDemoApp = () => {
  const [testregel, setTestregel] = useState<Testregel>();
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

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

  const onResultat = (
    resultat: TestregelResultat,
    elementOmtale: string,
    alleSvar: Svar[]
  ) => {
    console.log(
      `Resultat: ${JSON.stringify({ resultat, elementOmtale, alleSvar }, null, 2)}`
    );
  };

  if (!testregel || loading) {
    return <Spinner title="Laster" />;
  }

  return (
    <TestForm
      testregel={testregel}
      resultater={[createResultat(testregel)]}
      onClickSave={() => navigate('..')}
      onClickBack={() => navigate('..')}
      onResultat={onResultat}
    />
  );
};

export default TestregelDemoApp;

function createResultat(testregel: Testregel): ResultatManuellKontroll {
  return {
    id: 1,
    svar: [],
    status: 'UnderArbeid',
    sakId: 1,
    loeysingId: 1,
    testregelId: testregel.id,
    nettsideId: 1,
  };
}
