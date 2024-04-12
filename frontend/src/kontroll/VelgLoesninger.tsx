import { drop, isEmpty, take } from '@common/util/arrayUtils';
import { Alert, Button, Heading, Spinner } from '@digdir/designsystemet-react';
import { Utval } from '@loeysingar/api/types';
import { CheckmarkIcon } from '@navikt/aksel-icons';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import { useActionData, useLoaderData, useSubmit } from 'react-router-dom';

import classes from './kontroll.module.css';
import { Kontroll } from './types';

type SelectedUtvalg = { t: 'utvalg'; valgtUtvalg?: Utval };
type SelectedOption = SelectedUtvalg | { t: 'løsning' };
type SaveState =
  | { t: 'idle' }
  | { t: 'saving'; timestamp: Date }
  | { t: 'saved' };

function isSaving(
  saveState: SaveState
): saveState is { t: 'saving'; timestamp: Date } {
  return saveState.t === 'saving';
}

const VelgLoesninger = () => {
  const { kontroll, utval } = useLoaderData() as {
    kontroll: Kontroll;
    utval: Utval[];
  };
  const actionData = useActionData() as { sistLagret: Date };
  const [selectedOption, setSelectedOption] = React.useState<
    SelectedOption | undefined
  >(() => {
    if (kontroll?.utval) {
      return { t: 'utvalg', valgtUtvalg: kontroll.utval };
    }
  });
  const [saveState, setSaveState] = React.useState<SaveState>({ t: 'idle' });
  const submit = useSubmit();

  const utvalSortedByOppretta = utval.toSorted(
    (a, b) => b.oppretta.getTime() - a.oppretta.getTime()
  );
  const nyesteUtvalg = take(utvalSortedByOppretta, 6);
  const eldreUtvalg = drop(utvalSortedByOppretta, 6);

  useEffect(() => {
    if (actionData?.sistLagret && isSaving(saveState)) {
      const now = new Date();
      const diff = now.getTime() - saveState.timestamp.getTime();
      const wait = diff < 1000 ? 1000 - diff : 0;
      setTimeout(() => {
        setSaveState({ t: 'saved' });
      }, wait);
      setTimeout(() => {
        setSaveState({ t: 'idle' });
      }, wait + 3000);
    }
  }, [actionData]);

  function velgUtvalg(utval: Utval) {
    return function () {
      setSelectedOption({ t: 'utvalg', valgtUtvalg: utval });
    };
  }

  function isUtvalg(
    selectedOption: SelectedOption | undefined
  ): selectedOption is SelectedUtvalg {
    return selectedOption?.t === 'utvalg';
  }

  function isLoesning(
    selectedOption: SelectedOption | undefined
  ): selectedOption is { t: 'løsning' } {
    return selectedOption?.t === 'løsning';
  }

  function isValgt(utval: Utval) {
    return (
      isUtvalg(selectedOption) && selectedOption?.valgtUtvalg?.id === utval.id
    );
  }

  function lagre(gaaTilNeste: boolean): () => void {
    return () => {
      if (isUtvalg(selectedOption) && selectedOption.valgtUtvalg) {
        setSaveState({ t: 'saving', timestamp: new Date() });
        const data = {
          kontroll,
          utval: selectedOption.valgtUtvalg,
          neste: gaaTilNeste,
        };
        submit(JSON.stringify(data), {
          method: 'put',
          action: `/kontroll/${kontroll.id}/velg-losninger`,
          encType: 'application/json',
        });
      }
    };
  }

  return (
    <section className={classes.byggKontroll}>
      <nav className={classes.stepper}>
        <ol>
          <li>Opprett kontroll</li>
          <li className={classes.selected}>Velg løsninger</li>
          <li>Gjennomfør sideutvalg</li>
          <li>Testregler</li>
          <li>Oppsummering</li>
        </ol>
      </nav>
      <div className={classes.velgLoesningerOverskrift}>
        <Heading level={1} size="xlarge">
          Velg løsninger
        </Heading>
        <p>Velg hvilke løsninger du vil ha med i kontrollen</p>
      </div>
      <div className={classes.utvalgEllerManuelt}>
        <button
          onClick={() =>
            setSelectedOption({ t: 'utvalg', valgtUtvalg: kontroll?.utval })
          }
          className={classNames({
            [classes.selected]: isUtvalg(selectedOption),
          })}
        >
          Velg løsninger fra utvalg
        </button>
        <button
          onClick={() => setSelectedOption({ t: 'løsning' })}
          className={classNames({
            [classes.selected]: selectedOption?.t === 'løsning',
          })}
        >
          Velg løsninger selv
        </button>
      </div>
      {isUtvalg(selectedOption) && (
        <>
          <Heading level={2} size="large">
            Nyeste utvalg av løsninger
          </Heading>
          <div className={classes.nyesteUtvalgButtons}>
            {nyesteUtvalg.map((u) => (
              <button
                data-testid="utvalg"
                key={u.id}
                onClick={velgUtvalg(u)}
                className={classNames({ [classes.selected]: isValgt(u) })}
              >
                {u.namn}
              </button>
            ))}
          </div>
          {!isEmpty(eldreUtvalg) && (
            <>
              <Heading level={3} size="small">
                Eldre utvalg av løsninger
              </Heading>
              <ul className={classes.eldreUtvalg}>
                {eldreUtvalg.map((u) => (
                  <li key={u.id}>
                    <button
                      onClick={velgUtvalg(u)}
                      className={classNames({ [classes.selected]: isValgt(u) })}
                    >
                      {u.namn}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
          <div className={classes.lagreOgNeste}>
            <Button
              variant="secondary"
              onClick={lagre(false)}
              aria-disabled={isSaving(saveState)}
            >
              Lagre kontroll
            </Button>
            <Button
              variant="primary"
              onClick={lagre(true)}
              aria-disabled={isSaving(saveState)}
            >
              Neste
            </Button>
            {isSaving(saveState) && (
              <Spinner title={'Lagrer...'} size="small" />
            )}
            {saveState.t === 'saved' && (
              <span className={classes.lagret}>
                Lagret <CheckmarkIcon fontSize="1.5rem" />
              </span>
            )}
          </div>
        </>
      )}
      {isLoesning(selectedOption) && (
        <Alert elevated severity="warning">
          Manuelt valg av løsninger er ikke ferdig enda.
        </Alert>
      )}
    </section>
  );
};

export default VelgLoesninger;
