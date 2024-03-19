import { drop, isEmpty, take } from '@common/util/arrayUtils';
import { Heading } from '@digdir/designsystemet-react';
import { Utval } from '@loeysingar/api/types';
import React from 'react';
import { useLoaderData } from 'react-router-dom';

import classes from './kontroll.module.css';
import { OpprettetKontroll } from './types';

type UtvalgEllerLoesning = 'utvalg' | 'løsning';

const VelgLoesninger = () => {
  const { utval } = useLoaderData() as {
    kontroll: OpprettetKontroll;
    utval: Utval[];
  };
  const utvalSortedByOppretta = utval.toSorted(
    (a, b) => b.oppretta.getTime() - a.oppretta.getTime()
  );
  const [selectedOption, setSelectedOption] =
    React.useState<UtvalgEllerLoesning>();

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
      <div className={classes.utvalgButtons}>
        <button onClick={() => setSelectedOption('utvalg')}>
          Velg løsninger fra utvalg
        </button>
        <button onClick={() => setSelectedOption('løsning')}>
          Velg løsninger selv
        </button>
      </div>
      {selectedOption === 'utvalg' && (
        <>
          <Heading level={2} size="large">
            Nyeste utvalg av løsninger
          </Heading>
          <ul>
            {take(utvalSortedByOppretta, 6).map((u) => (
              <li key={u.id}>{u.namn}</li>
            ))}
          </ul>
          {!isEmpty(drop(utvalSortedByOppretta, 6)) && (
            <>
              <Heading level={3} size="small">
                Eldre utvalg av løsninger
              </Heading>
              <ul>
                {drop(utvalSortedByOppretta, 6).map((u) => (
                  <li key={u.id}>{u.namn}</li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
      {selectedOption === 'løsning' && <p>Velg løsning selv</p>}
    </section>
  );
};

export default VelgLoesninger;
