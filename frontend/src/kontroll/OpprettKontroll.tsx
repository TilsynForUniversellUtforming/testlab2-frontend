import {
  Alert,
  Button,
  Combobox,
  Heading,
  Radio,
  RadioGroup,
  Textfield,
} from '@digdir/designsystemet-react';
import {
  ActionFunctionArgs,
  Form,
  redirect,
  useActionData,
} from 'react-router-dom';

import classes from './kontroll.module.css';

export default function OpprettKontroll() {
  const errors = useActionData() as Errors;
  return (
    <section className={classes.byggKontroll}>
      <nav className={classes.stepper}>
        <ol>
          <li className={classes.selected}>Opprett kontroll</li>
          <li>Velg løsninger</li>
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
      <Form method="post" className={classes.skjema}>
        <Heading level={2} size="medium" className={classes.skjemaOverskrift}>
          Kontrolltype
        </Heading>
        <Combobox
          className={classes.comboBox}
          label="Velg kontrolltype"
          name="kontrolltype"
          id="kontrolltype"
          error={errors?.kontrolltype}
        >
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
        <Textfield
          label="Tittel"
          className={classes.tittel}
          name="tittel"
          id="tittel"
          error={errors?.tittel}
        />
        <Textfield
          label="Saksbehandler"
          className={classes.saksbehandler}
          name="saksbehandler"
          id="saksbehandler"
          error={errors?.saksbehandler}
        />
        <RadioGroup
          legend="Hva slags sak er det?"
          name="sakstype"
          id="sakstype"
          error={errors?.sakstype}
        >
          <Radio value="forvaltningssak">Forvaltningssak</Radio>
          <Radio value="arkivsak">Arkivsak</Radio>
        </RadioGroup>
        <Textfield
          label="Arkivreferanse"
          className={classes.arkivreferanse}
          name="arkivreferanse"
          id="arkivreferanse"
          error={errors?.arkivreferanse}
        />
        <Button type="submit" className={classes.opprettResten}>
          Opprett resten av kontrollen
        </Button>
        {errors?.server && <Alert severity="danger">{errors.server}</Alert>}
      </Form>
    </section>
  );
}

type Errors = {
  kontrolltype?: string;
  tittel?: string;
  saksbehandler?: string;
  sakstype?: string;
  arkivreferanse?: string;
  server?: string;
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const kontrolltype = formData.get('kontrolltype');
  const tittel = formData.get('tittel');
  const saksbehandler = formData.get('saksbehandler');
  const sakstype = formData.get('sakstype');
  const arkivreferanse = formData.get('arkivreferanse');
  const errors: Errors = {};

  if (kontrolltype !== 'manuell-kontroll') {
    errors.kontrolltype = 'Kontrolltype må være manuell kontroll';
  }
  if (!tittel) {
    errors.tittel = 'Tittel må fylles ut';
  }
  if (!saksbehandler) {
    errors.saksbehandler = 'Saksbehandler må fylles ut';
  }
  if (!sakstype) {
    errors.sakstype = 'Du må velge en sakstype';
  }
  if (!arkivreferanse) {
    errors.arkivreferanse = 'Kontrollen må ha en arkivreferanse';
  }

  if (Object.keys(errors).length > 0) {
    return errors;
  } else {
    const response = await fetch('/api/v1/kontroller', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        kontrolltype,
        tittel,
        saksbehandler,
        sakstype,
        arkivreferanse,
      }),
    });
    if (response.ok) {
      const { kontrollId } = await response.json();
      return redirect(`/kontroll/${kontrollId}/velg-losninger`);
    } else {
      errors.server =
        'Klarte ikke å opprette en ny kontroll. Dette er en systemfeil som må undersøkes og rettes opp i før vi kommer videre.';
      return errors;
    }
  }
}
