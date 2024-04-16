import { Heading } from '@digdir/designsystemet-react';

import kontrollClasses from '../kontroll.module.css';

export function Oppsummering() {
  return (
    <section className={kontrollClasses.kontrollSection}>
      <nav className={kontrollClasses.stepper}>
        <ol>
          <li>Opprett kontroll</li>
          <li>Velg løsninger</li>
          <li>Gjennomfør sideutvalg</li>
          <li>Testregler</li>
          <li className={kontrollClasses.selected}>Oppsummering</li>
        </ol>
      </nav>
      <Heading level={1}>Oppsummering</Heading>
    </section>
  );
}
