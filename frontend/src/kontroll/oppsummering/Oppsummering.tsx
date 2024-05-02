import { Button, Heading, Pagination, Tag } from '@digdir/designsystemet-react';
import { Loeysing, Utval } from '@loeysingar/api/types';
import { CheckmarkCircleIcon, CircleSlashIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';

import kontrollClasses from '../kontroll.module.css';
import { steps } from '../KontrollRoutes';
import { Kontroll, KontrollType } from '../types';
import classes from './oppsummering.module.css';

export function Oppsummering() {
  const kontroll = useLoaderData() as Kontroll;
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const elementsPerPage = 7;
  const totalPages = Math.ceil(
    (kontroll.utval?.loeysingar?.length ?? 0) / elementsPerPage
  );

  function listeElement(loeysing: Loeysing) {
    return (
      <li className={classes.listeelement} key={loeysing.id}>
        <div className={classes.navn} title={loeysing.namn}>
          {loeysing.namn}
        </div>
        <div className={classes.nettstederOgMobilapper}>
          <div className={classes.nettsteder}>
            <CheckmarkCircleIcon fontSize={24} />
            Nettsteder
          </div>
          <div className={classes.mobilapper}>
            <CircleSlashIcon fontSize={24} />
            Mobilapper
          </div>
        </div>
      </li>
    );
  }

  function viewKontrollType(kontrolltype: KontrollType) {
    switch (kontrolltype) {
      case 'manuell-kontroll':
        return 'Manuell kontroll';
      default:
        console.error('Ukjent kontrolltype', kontrolltype);
        return 'Ukjent kontrolltype';
    }
  }

  function viewUtvalNamn(utval: Utval | undefined) {
    if (utval?.namn) {
      return utval.namn;
    } else {
      console.error('Utval mangler på denne kontrollen');
      return 'Utval mangler';
    }
  }

  function getPage(
    loeysingar: Loeysing[] | undefined,
    currentPage: number
  ): Loeysing[] {
    if (!loeysingar || loeysingar.length === 0) {
      return [];
    }

    const start = (currentPage - 1) * elementsPerPage;
    const end = start + elementsPerPage;
    return loeysingar.slice(start, end);
  }

  function lagreOgLukk() {
    navigate('/');
  }

  return (
    <section className={kontrollClasses.kontrollSection}>
      <Heading level={1} className={classes.hovedoverskrift}>
        Kontrollen er opprettet
      </Heading>
      <div className={classes.overskriftMedTags}>
        <Heading level={2} size="medium">
          {kontroll.tittel}
        </Heading>
        <div className={classes.tags}>
          <Tag color="first">{viewKontrollType(kontroll.kontrolltype)}</Tag>
          <Tag color="first">{kontroll.saksbehandler}</Tag>
        </div>
        <p>Du er ferdig med å opprette kontrollen.</p>
        <p>
          Virksomheter, løsninger og testregler er på plass. Dersom du ønsker å
          redigere disse, kan du gjøre det på et senere tidspunkt, eller gå
          tilbake og redigere med en gang.{' '}
        </p>
        <p>
          Vil du opprette flere kontroller, eller er ferdig for nå, velger du
          lagre og lukk. Da kommer du tilbake til startsiden.
        </p>
        <p>
          Vil du gjennomføre testen, velg hvem du vil starte med fra listen
          under.{' '}
        </p>
        <Button variant="secondary" onClick={lagreOgLukk}>
          Lagre og lukk
        </Button>
      </div>

      <div className={classes.overskriftMedTags}>
        <Heading level={2} size="medium">
          Hvem vil du starte med?
        </Heading>
        <div className={classes.tags}>
          <Tag color="first">{viewUtvalNamn(kontroll.utval)}</Tag>
        </div>
        <ul className={classes.liste}>
          {getPage(kontroll.utval?.loeysingar, currentPage).map(listeElement)}
        </ul>
        <Pagination
          className={classes.pagination}
          nextLabel="Neste"
          previousLabel="Forrige"
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={setCurrentPage}
        />
      </div>
      <Button
        variant="secondary"
        onClick={() =>
          navigate(`../${kontroll.id}/${steps.sideutval.relativePath}`)
        }
      >
        Tilbake
      </Button>
    </section>
  );
}
