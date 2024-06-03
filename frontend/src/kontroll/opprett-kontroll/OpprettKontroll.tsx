import TestlabForm from '@common/form/TestlabForm';
import TestlabFormInput from '@common/form/TestlabFormInput';
import TestlabFormSelect from '@common/form/TestlabFormSelect';
import { createOptionsFromLiteral } from '@common/util/stringutils';
import {
  Alert,
  Button,
  Heading,
  Paragraph,
} from '@digdir/designsystemet-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useActionData, useSubmit } from 'react-router-dom';

import classes from '../kontroll.module.css';
import KontrollStepper from '../stepper/KontrollStepper';
import { KontrollType, Sakstype } from '../types';
import { Errors } from './OpprettKontrollRoute';
import {
  CreateKontrollType,
  opprettKontrollValidationSchema,
} from './opprettKontrollValidationSchema';

export default function OpprettKontroll() {
  const submit = useSubmit();

  const formMethods = useForm<CreateKontrollType>({
    defaultValues: {
      kontrolltype: 'inngaaende-kontroll',
      tittel: '',
      saksbehandler: '',
      sakstype: 'forvaltningssak',
      arkivreferanse: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(opprettKontrollValidationSchema),
  });

  const errors = useActionData() as Errors;

  const onSubmit = (data: CreateKontrollType) => {
    submit(JSON.stringify(data), {
      method: 'post',
      encType: 'application/json',
    });
  };

  return (
    <section className={classes.kontrollSection}>
      <KontrollStepper />
      <Heading level={1} size="xlarge">
        Bygg kontroll
      </Heading>
      <p className={classes.ingress}>
        Opprett en ny kontroll. Du vil i senere steg kunne legge inn
        virksomheter og løsninger.
      </p>
      <TestlabForm
        className={classes.skjema}
        formMethods={formMethods}
        onSubmit={onSubmit}
        hasRequiredFields={false}
      >
        <div className={classes.skjemaOverskrift}>
          <Heading level={2} size="medium">
            Kontrolltype
          </Heading>
          <Paragraph size="small">
            Felter markert med stjerne er obligatoriske
          </Paragraph>
        </div>
        <TestlabFormSelect
          className={classes.comboBox}
          label="Velg kontrolltype"
          name="kontrolltype"
          id="kontrolltype"
          options={createOptionsFromLiteral<KontrollType>([
            'inngaaende-kontroll',
            'forenkla-kontroll',
            'tilsyn',
            'statusmaaling',
            'uttalesak',
            'anna',
          ])}
          required
        />
        <TestlabFormInput
          label="Tittel"
          className={classes.tittel}
          name="tittel"
          id="tittel"
          size="medium"
          required
        />
        <TestlabFormInput
          label="Saksbehandler"
          className={classes.saksbehandler}
          name="saksbehandler"
          id="saksbehandler"
          size="medium"
          required
        />
        <TestlabFormSelect
          label="Hva slags sak er det?"
          name="sakstype"
          id="sakstype"
          options={createOptionsFromLiteral<Sakstype>([
            'forvaltningssak',
            'arkivsak',
          ])}
          radio
          required
        />
        <TestlabFormInput
          label="Arkivreferanse"
          className={classes.arkivreferanse}
          name="arkivreferanse"
          size="medium"
          id="arkivreferanse"
        />
        <Button type="submit" className={classes.opprettResten}>
          Opprett resten av kontrollen
        </Button>
        {errors?.server && <Alert severity="danger">{errors.server}</Alert>}
      </TestlabForm>
    </section>
  );
}
