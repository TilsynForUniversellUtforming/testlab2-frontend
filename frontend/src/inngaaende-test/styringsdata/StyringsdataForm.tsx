import TestlabForm from '@common/form/TestlabForm';
import TestlabFormInput from '@common/form/TestlabFormInput';
import TestlabFormSelect from '@common/form/TestlabFormSelect';
import TestlabFormTextArea from '@common/form/TestlabFormTextArea';
import { getErrorMessage } from '@common/form/util';
import { ButtonVariant } from '@common/types';
import { createOptionsFromLiteral } from '@common/util/stringutils';
import { isDefined } from '@common/util/validationUtils';
import {
  Accordion,
  Button,
  ErrorSummary,
  Heading,
  Paragraph,
  Tag,
} from '@digdir/designsystemet-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { styringsdataValidationSchema } from '@test/styringsdata/styringsdataValidationSchema';
import {
  KlageType,
  ResultatKlage,
  Styringsdata,
  StyringsdataFormData,
  StyringsdataLoaderData,
} from '@test/styringsdata/types';
import { getIdFromParams } from '@test/util/testregelUtils';
import { useForm, UseFormRegister } from 'react-hook-form';
import { Link, useLoaderData, useParams, useSubmit } from 'react-router-dom';

import classes from './styringsdata.module.css';

const KlageInputs = ({
  klageType,
  register,
}: {
  klageType: KlageType;
  register: UseFormRegister<StyringsdataFormData>;
}) => {
  const klageName = klageType === 'bot' ? 'botKlage' : 'paaleggKlage';
  const options = createOptionsFromLiteral<ResultatKlage>([
    'stadfesta',
    'delvis-omgjort',
    'omgjort',
    'oppheva',
  ]);

  return (
    <>
      <input type="hidden" {...register(`${klageName}.id` as const)} />
      <TestlabFormInput<StyringsdataFormData>
        label="Klage mottatt dato"
        name={`${klageName}.klageMottattDato`}
        type="date"
      />
      <TestlabFormInput<StyringsdataFormData>
        label="Klage avgjort dato"
        name={`${klageName}.klageAvgjortDato`}
        type="date"
      />
      <TestlabFormSelect<StyringsdataFormData>
        options={options}
        label="Resultat klage tilsynet"
        name={`${klageName}.resultatKlageTilsyn`}
      />
      <TestlabFormInput<StyringsdataFormData>
        label="Klage sendt til departementet"
        name={`${klageName}.klageDatoDepartement`}
        type="date"
      />
      <TestlabFormSelect<StyringsdataFormData>
        options={options}
        label="Resultat klage departement"
        name={`${klageName}.resultatKlageDepartement`}
      />
    </>
  );
};

const StyringsdataForm = () => {
  const {
    kontrollTittel,
    arkivreferanse,
    loeysingNamn,
    verksemdNamn,
    styringsdata,
  } = useLoaderData() as StyringsdataLoaderData;

  const { id: kontrollIdParam, loeysingId: loeysingIdParam } = useParams();
  const kontrollId = getIdFromParams(kontrollIdParam);
  const loeysingId = getIdFromParams(loeysingIdParam);

  const isEdit = isDefined(styringsdata);

  const submit = useSubmit();

  const formMethods = useForm<StyringsdataFormData>({
    defaultValues: {
      ansvarleg: styringsdata?.ansvarleg ?? '',
      oppretta: styringsdata?.oppretta,
      frist: styringsdata?.frist,
      reaksjon: styringsdata?.reaksjon ?? 'ingen-reaksjon',
      paalegg: styringsdata?.paalegg ?? {
        frist: undefined,
        vedtakDato: undefined,
      },
      paaleggKlage: styringsdata?.paaleggKlage ?? {
        klageType: undefined,
        klageMottattDato: undefined,
        klageAvgjortDato: undefined,
        resultatKlageTilsyn: undefined,
        klageDatoDepartement: undefined,
        resultatKlageDepartement: undefined,
      },
      bot: styringsdata?.bot ?? {
        beloepDag: undefined,
        oekingEtterDager: undefined,
        oekningType: 'kroner',
        oekingSats: undefined,
        vedtakDato: undefined,
        startDato: undefined,
        sluttDato: undefined,
        kommentar: undefined,
      },
      botKlage: styringsdata?.botKlage ?? {
        klageType: undefined,
        klageMottattDato: undefined,
        klageAvgjortDato: undefined,
        resultatKlageTilsyn: undefined,
        klageDatoDepartement: undefined,
        resultatKlageDepartement: undefined,
      },
    },
    mode: 'onBlur',
    resolver: zodResolver(styringsdataValidationSchema),
  });

  const { watch, formState } = formMethods;

  const onSubmit = (formData: StyringsdataFormData) => {
    const data: Styringsdata = {
      id: formData?.id,
      kontrollId: kontrollId,
      loeysingId: loeysingId,
      ...formData,
    };

    if (isEdit) {
      submit(JSON.stringify(data), {
        method: 'put',
        encType: 'application/json',
      });
    } else {
      submit(JSON.stringify(data), {
        method: 'POST',
        encType: 'application/json',
      });
    }
  };

  const reaksjon = watch('reaksjon', 'ingen-reaksjon');

  const paaleggError = isDefined(getErrorMessage(formState, 'paalegg'));
  const botError = isDefined(getErrorMessage(formState, 'bot'));

  const { register } = formMethods;

  return (
    <div className={classes.styringsdata}>
      <div className={classes.styringsdataForm}>
        <Heading level={2} size="medium" spacing>
          {' '}
          Styringsdata {loeysingNamn}
        </Heading>
        <Paragraph spacing>Legg til styringsdata for denne løysinga</Paragraph>
        <div className={classes.styringsdataTags}>
          <Tag color="second">{kontrollTittel}</Tag>
          <Tag color="second">{verksemdNamn}</Tag>
        </div>
        {arkivreferanse && <Tag>{arkivreferanse}</Tag>}
        <TestlabForm<StyringsdataFormData>
          formMethods={formMethods}
          onSubmit={onSubmit}
          className={classes.styringsdataForm}
          hasRequiredFields
        >
          <input type="hidden" {...register('id' as const)} />
          <TestlabFormInput<StyringsdataFormData>
            label="Ansvarleg"
            name="ansvarleg"
            required
          />
          <TestlabFormInput<StyringsdataFormData>
            label="Oppretta"
            name="oppretta"
            type="date"
            required
          />
          <TestlabFormInput<StyringsdataFormData>
            label="Frist for gjennomføring"
            name="frist"
            type="date"
            required
          />
          <Heading level={3} size="small">
            Saksbehandling
          </Heading>
          <Paragraph size="small" spacing>
            Ansvarleg for kontrollen kan redigera og leggja til aktivitetar i
            samband med kontroll av denne løysinga.
            <br />
            Desse felta triggar inga handling, det er berre for intern oversikt.
            Dialog med part går føre seg i andre kanalar.
          </Paragraph>
          <TestlabFormSelect<StyringsdataFormData>
            label="Aktivitet"
            description="Er det forventet å bruke reaksjoner til denne løsningen?"
            options={[
              { value: 'reaksjon', label: 'Ja' },
              { value: 'ingen-reaksjon', label: 'Nei' },
            ]}
            name="reaksjon"
            radio
          />
          {reaksjon === 'reaksjon' && (
            <Accordion color="first" border>
              <Accordion.Item>
                <Accordion.Header level={3}>Pålegg</Accordion.Header>
                <Accordion.Content>
                  <input type="hidden" {...register('paalegg.id' as const)} />
                  <TestlabFormInput<StyringsdataFormData>
                    label="Pålegg vedtak dato"
                    name="paalegg.vedtakDato"
                    type="date"
                  />
                  <TestlabFormInput<StyringsdataFormData>
                    label="Pålegg frist"
                    name="paalegg.frist"
                    type="date"
                  />
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header level={3}>Pålegg klage</Accordion.Header>
                <Accordion.Content>
                  <KlageInputs klageType={'paalegg'} register={register} />
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item open={botError}>
                <Accordion.Header level={3}>Bot</Accordion.Header>
                <Accordion.Content>
                  <input type="hidden" {...register('bot.id' as const)} />
                  <TestlabFormInput<StyringsdataFormData>
                    label="Bot (tvangsmulkt) beløp"
                    name="bot.beloepDag"
                  />
                  <TestlabFormInput<StyringsdataFormData>
                    label="Antall dager før økning"
                    name="bot.oekingEtterDager"
                  />
                  <div className={classes.oekingType}>
                    <TestlabFormInput<StyringsdataFormData>
                      label="Økning pr dag"
                      name="bot.oekingSats"
                    />
                    <TestlabFormSelect<StyringsdataFormData>
                      label={''}
                      options={[
                        { value: 'kroner', label: 'NOK' },
                        { value: 'prosent', label: '%' },
                      ]}
                      name="bot.oekningType"
                      radio
                      radioInline
                    />
                  </div>
                  <TestlabFormInput<StyringsdataFormData>
                    label="Når ble vedtak om bot iverksatt?"
                    name="bot.vedtakDato"
                    type="date"
                  />
                  <TestlabFormInput<StyringsdataFormData>
                    label="Startdato for bot"
                    name="bot.startDato"
                    type="date"
                  />
                  <TestlabFormInput<StyringsdataFormData>
                    label="Sluttdato for bot"
                    name="bot.sluttDato"
                    type="date"
                  />
                  <TestlabFormTextArea<StyringsdataFormData>
                    label="Kommentar"
                    name="bot.kommentar"
                  />
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header level={3}>Bot klage</Accordion.Header>
                <Accordion.Content>
                  <KlageInputs klageType={'bot'} register={register} />
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          )}
          {(botError || paaleggError) && (
            <ErrorSummary.Root size="md">
              <ErrorSummary.Heading>Feil i skjema</ErrorSummary.Heading>
              <ErrorSummary.List>
                {botError && (
                  <ErrorSummary.Item href="#">
                    Bot må fylles ut før man kan legge inn klage
                  </ErrorSummary.Item>
                )}
                {paaleggError && (
                  <ErrorSummary.Item href="#">
                    Pålegg må fylles ut før man kan legge inn klage
                  </ErrorSummary.Item>
                )}
              </ErrorSummary.List>
            </ErrorSummary.Root>
          )}
          <div className={classes.buttons}>
            <Link to={'..'}>
              <Button variant={ButtonVariant.Outline}>Tilbake</Button>
            </Link>
            <Button type="submit">Lagre</Button>
          </div>
        </TestlabForm>
      </div>
    </div>
  );
};

export default StyringsdataForm;
