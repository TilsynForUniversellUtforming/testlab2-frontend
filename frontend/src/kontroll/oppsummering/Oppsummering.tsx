import { Button, Heading, Tag } from '@digdir/designsystemet-react';
import {
  CheckmarkCircleIcon,
  CircleSlashIcon,
  TrashIcon,
} from '@navikt/aksel-icons';

import kontrollClasses from '../kontroll.module.css';
import KontrollStepper from '../stepper/KontrollStepper';
import classes from './oppsummering.module.css';

export function Oppsummering() {
  function listeElement(navn: string) {
    return (
      <li className={classes.listeelement}>
        <div className={classes.navn}>{navn}</div>
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
        >
          Legg til styringsdata
        </Button>
        <Button variant="tertiary" className={classes.slett}>
          <TrashIcon fontSize={24} />
          Slett
        </Button>
      </li>
    );
  }

  return (
    <section className={kontrollClasses.kontrollSection}>
      <KontrollStepper />
      <Heading level={1} className={classes.hovedoverskrift}>
        Oppsummering
      </Heading>
      <div className={classes.overskriftMedTags}>
        <Heading level={2} size="medium">
          Sektortilsyn 2024
        </Heading>
        <div className={classes.tags}>
          <Tag color="first">Tilsyn</Tag>
          <Tag color="first">Navn på ansvarlig</Tag>
        </div>
      </div>
      <div className={classes.overskriftMedTags}>
        <Heading level={2} size="medium">
          Virksomheter og løsninger i denne testen
        </Heading>
        <div className={classes.tags}>
          <Tag color="first">Adrians utvalgte</Tag>
        </div>
      </div>
      <ul className={classes.liste}>
        {[
          'Eidefjord kommune',
          'Tvedestrand kommune',
          'Tverrlandet kommune',
        ].map(listeElement)}
      </ul>
      <Button className={classes.neste}>Neste</Button>
    </section>
  );
}
