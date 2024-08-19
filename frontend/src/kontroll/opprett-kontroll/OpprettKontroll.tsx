import TestlabForm from '@common/form/TestlabForm';
import TestlabFormInput from '@common/form/TestlabFormInput';
import TestlabFormSelect from '@common/form/TestlabFormSelect';
import { createOptionsFromLiteral } from '@common/util/stringutils';
import { isDefined } from '@common/util/validationUtils';
import {
  Alert,
  Button,
  Heading,
  Paragraph,
} from '@digdir/designsystemet-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  useActionData,
  useLoaderData,
  useParams,
  useSubmit,
} from 'react-router-dom';

import classes from '../kontroll.module.css';
import KontrollStepper from '../stepper/KontrollStepper';
import { Kontroll, KontrollType, Sakstype } from '../types';
import {
  KontrollInit,
  kontrollInitValidationSchema,
} from './kontrollInitValidationSchema';
import { Errors } from './OpprettKontrollRoute';

export default function OpprettKontroll() {
  const submit = useSubmit();
  const kontroll = useLoaderData() as Kontroll | undefined;
  const { kontrollId } = useParams();
  const editMode = isDefined(kontrollId);

  const formMethods = useForm<KontrollInit>({
    defaultValues: {
      id: kontroll?.id ?? undefined,
      kontrolltype: kontroll?.kontrolltype ?? KontrollType.InngaaendeKontroll,
      tittel: kontroll?.tittel ?? '',
      saksbehandler: kontroll?.saksbehandler ?? '',
      sakstype: kontroll?.sakstype ?? 'forvaltningssak',
      arkivreferanse: kontroll?.arkivreferanse ?? '',
    },
    mode: 'onBlur',
    resolver: zodResolver(kontrollInitValidationSchema),
  });

  const errors = useActionData() as Errors;

  const onSubmit = (formData: KontrollInit) => {
    if (kontrollId && kontroll) {
      const kontrollEdit = {
        ...kontroll,
        tittel: formData.tittel,
        saksbehandler: formData.saksbehandler,
        sakstype: formData.sakstype,
        arkivreferanse: formData.arkivreferanse,
      };
      submit(JSON.stringify(kontrollEdit), {
        method: 'put',
        encType: 'application/json',
        action: `/kontroll/${kontrollId}`,
      });
    } else {
      submit(JSON.stringify(formData), {
        method: 'post',
        encType: 'application/json',
      });
    }
  };

  const { register } = formMethods;

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
        <input type="hidden" {...register('id' as const)} />
        <TestlabFormSelect
          className={classes.comboBox}
          label="Velg kontrolltype"
          name="kontrolltype"
          id="kontrolltype"
          options={createOptionsFromLiteral<KontrollType>(
            Object.values(KontrollType)
          )}
          required
          disabled={editMode}
          aria-label={editMode ? 'Kan ikkje endre kontrolltype' : ''}
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
