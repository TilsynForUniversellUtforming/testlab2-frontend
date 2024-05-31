import { drop, isEmpty, take } from '@common/util/arrayUtils';
import { formatDate } from '@common/util/stringutils';
import { Alert, Heading } from '@digdir/designsystemet-react';
import { Utval } from '@loeysingar/api/types';
import classNames from 'classnames';
import React from 'react';
import { useActionData, useLoaderData, useSubmit } from 'react-router-dom';

import classes from '../kontroll.module.css';
import LagreOgNeste from '../lagre-og-neste/LagreOgNeste';
import KontrollStepper from '../stepper/KontrollStepper';
import { Kontroll } from '../types';

type SelectedUtvalg = { t: 'utvalg'; valgtUtvalg?: Utval };
type SelectedOption = SelectedUtvalg | { t: 'løsning' };

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
  const submit = useSubmit();

  const utvalSortedByOppretta = utval.toSorted(
    (a, b) => b.oppretta.getTime() - a.oppretta.getTime()
  );
  const nyesteUtvalg = take(utvalSortedByOppretta, 6);
  const eldreUtvalg = drop(utvalSortedByOppretta, 6);

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
    <section className={classes.kontrollSection}>
      <KontrollStepper />
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
                <span className={classes.utvalgNamn}>{u.namn}</span>
                <span className={classes.utvalgOppretta}>
                  {formatDate(u.oppretta)}
                </span>
              </button>
            ))}
          </div>
          {!isEmpty(eldreUtvalg) && (
            <>
              <Heading level={2} size="large">
                Eldre utvalg av løsninger
              </Heading>
              <ul className={classes.eldreUtvalg}>
                {eldreUtvalg.map((u) => {
                  const valgt = isValgt(u);
                  return (
                    <li
                      key={u.id}
                      className={classNames({ [classes.selected]: valgt })}
                    >
                      <button
                        onClick={velgUtvalg(u)}
                        className={classNames({ [classes.selected]: valgt })}
                        title={u.namn}
                      >
                        {u.namn}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
          <LagreOgNeste
            sistLagret={actionData?.sistLagret}
            onClickLagreKontroll={lagre(false)}
            onClickNeste={lagre(true)}
          />
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
