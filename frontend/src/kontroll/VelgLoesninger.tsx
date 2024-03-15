import { Heading } from '@digdir/design-system-react';
import React from 'react';

import classes from './kontroll.module.css';

const VelgLoesninger = () => {
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
        <Heading level={1}>Velg løsninger</Heading>
        <p>Velg hvilke løsninger du vil ha med i kontrollen</p>
      </div>
      <div className={classes.utvalgButtons}>
        <button>Velg løsninger fra utvalg</button>
        <button>Velg løsninger selv</button>
      </div>
    </section>
  );
};

export default VelgLoesninger;
