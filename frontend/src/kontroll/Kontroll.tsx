import {
  Button,
  Combobox,
  Heading,
  Radio,
  RadioGroup,
  Textfield,
} from '@digdir/design-system-react';

import classes from './kontroll.module.css';

export default function Kontroll() {
  return (
    <section className={classes.byggKontroll}>
      <nav className={classes.stepper}>
        <ol>
          <li>Opprett kontroll</li>
          <li>Velg virksomhet</li>
          <li>Gjennomfør sideutvalg</li>
          <li>Testregler</li>
          <li>Oppsummering</li>
        </ol>
      </nav>
      <Heading level={1} size="xlarge">
        Bygg kontroll
      </Heading>
      <p className={classes.ingress}>
        Opprett en ny kontroll. Du vil i senere steg kunne legge inn
        virksomheter og løsninger.
      </p>
      <section className={classes.skjema}>
        <Heading level={2} size="medium">
          Kontrolltype
        </Heading>
        <Combobox className={classes.comboBox} label="Velg kontrolltype">
          <Combobox.Option value="Tilsyn">Tilsyn</Combobox.Option>
          <Combobox.Option value="manuell-kontroll">
            Manuell kontroll
          </Combobox.Option>
          <Combobox.Option value="automatisk-kontroll">
            Automatisk kontroll
          </Combobox.Option>
          <Combobox.Option value="statusmaaling">Statusmåling</Combobox.Option>
          <Combobox.Option value="uttalesak">Uttalesak</Combobox.Option>
          <Combobox.Option value="annet">Annet</Combobox.Option>
        </Combobox>
        <Textfield label="Tittel" className={classes.tittel} />
        <Textfield label="Saksbehandler" className={classes.saksbehandler} />
        <RadioGroup legend="Hva slags sak er det?">
          <Radio value="forvaltningssak">Forvaltningssak</Radio>
          <Radio value="arkivsak">Arkivsak</Radio>
        </RadioGroup>
        <Textfield label="Arkivreferanse" className={classes.arkivreferanse} />
        <Button className={classes.opprettResten}>
          Opprett resten av kontrollen
        </Button>
      </section>
    </section>
  );
}
