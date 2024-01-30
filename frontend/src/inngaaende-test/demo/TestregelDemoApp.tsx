import '../test.scss';

import { takeWhile } from '@common/util/arrayUtils';
import { Spinner } from '@digdir/design-system-react';
import { Svar } from '@test/api/types';
import { getTestregel } from '@testreglar/api/testreglar-api';
import { Testregel } from '@testreglar/api/types';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import TestForm from '../testregel-form/TestForm';
import {
  AlleSvar,
  lagSkjemaModell,
  SkjemaModell,
} from '../util/testregelParser';

type SkjemaOgSvar = { skjemamodell: SkjemaModell; svar: AlleSvar };

const TestregelDemoApp = () => {
  const [testregel, setTestregel] = useState<Testregel>();
  const [skjemaOgSvar, setSkjemaOgSvar] = useState<SkjemaOgSvar>({
    skjemamodell: { steg: [], delutfall: [] },
    svar: [],
  });

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
            setSkjemaOgSvar((prevState) => ({
              ...prevState,
              skjemamodell: lagSkjemaModell(
                testregel.testregelSchema,
                skjemaOgSvar.svar
              ),
            }));
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

  useEffect(() => {
    console.log(`state updated: ${JSON.stringify(skjemaOgSvar, null, 2)}`);
  }, [skjemaOgSvar]);

  const updateAnswers = (nyttSvar: Svar) => {
    if (testregel) {
      setSkjemaOgSvar((prevState) => {
        const oppdaterteSvar = takeWhile(
          prevState.svar,
          (svar) => svar.steg !== nyttSvar.steg
        ).concat([nyttSvar]);
        return {
          ...prevState,
          skjemamodell: lagSkjemaModell(
            testregel.testregelSchema,
            oppdaterteSvar
          ),
          svar: oppdaterteSvar,
        };
      });
    }
  };

  if (!testregel || loading) {
    return <Spinner title="Laster" />;
  }

  return (
    <TestForm
      heading={testregel.name}
      skjemaModell={skjemaOgSvar.skjemamodell}
      alleSvar={skjemaOgSvar.svar}
      onClickSave={() => navigate('..')}
      onClickBack={() => navigate('..')}
      updateResult={updateAnswers}
    />
  );
};

export default TestregelDemoApp;
