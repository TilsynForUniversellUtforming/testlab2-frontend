import { Button, Heading, Tag } from '@digdir/designsystemet-react';
import { Loeysing, Utval } from '@loeysingar/api/types';
import {
  CheckmarkCircleIcon,
  CircleSlashIcon,
  TrashIcon,
} from '@navikt/aksel-icons';
import { useLoaderData } from 'react-router-dom';

import kontrollClasses from '../kontroll.module.css';
import KontrollStepper from '../stepper/KontrollStepper';
import { Kontroll, KontrollType } from '../types';
import classes from './oppsummering.module.css';

export function Oppsummering() {
  const kontroll = useLoaderData() as Kontroll;

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
        <Button
          className={classes.styringsdata}
          size="small"
          variant="secondary"
          disabled={true}
        >
          Legg til styringsdata
        </Button>
        <Button variant="tertiary" className={classes.slett} disabled={true}>
          <TrashIcon fontSize={24} />
          Slett
        </Button>
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

  return (
    <section className={kontrollClasses.kontrollSection}>
      <KontrollStepper />
      <Heading level={1} className={classes.hovedoverskrift}>
        Oppsummering
      </Heading>
      <div className={classes.overskriftMedTags}>
        <Heading level={2} size="medium">
          {kontroll.tittel}
        </Heading>
        <div className={classes.tags}>
          <Tag color="first">{viewKontrollType(kontroll.kontrolltype)}</Tag>
          <Tag color="first">{kontroll.saksbehandler}</Tag>
        </div>
      </div>
      <div className={classes.overskriftMedTags}>
        <Heading level={2} size="medium">
          Virksomheter og løsninger i denne testen
        </Heading>
        <div className={classes.tags}>
          <Tag color="first">{viewUtvalNamn(kontroll.utval)}</Tag>
        </div>
      </div>
      <ul className={classes.liste}>
        {kontroll.utval?.loeysingar?.map(listeElement)}
      </ul>
      <Button className={classes.neste}>Neste</Button>
    </section>
  );
}
