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
import SaveButton from '@test/styringsdata/SaveButton';
import { styringsdataValidationSchema } from '@test/styringsdata/styringsdataValidationSchema';
import {
  KlageType,
  ResultatKlage,
  Styringsdata,
  StyringsdataLoaderData,
} from '@test/styringsdata/types';
import { getIdFromParams } from '@test/util/testregelUtils';
import { useForm, UseFormRegister } from 'react-hook-form';
import { Link, useLoaderData, useParams, useSubmit } from 'react-router-dom';

import classes from './styringsdata.module.css';

const reaksjonOptions = [
  { value: 'reaksjon', label: 'Ja' },
  { value: 'ingen-reaksjon', label: 'Nei' },
];

const KlageInputs = ({
  klageType,
  register,
}: {
  klageType: KlageType;
  register: UseFormRegister<Styringsdata>;
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
      <TestlabFormInput<Styringsdata>
        label="Klage mottatt dato"
        name={`${klageName}.klageMottattDato`}
        type="date"
      />
      <TestlabFormInput<Styringsdata>
        label="Klage avgjort dato"
        name={`${klageName}.klageAvgjortDato`}
        type="date"
      />
      <TestlabFormSelect<Styringsdata>
        options={options}
        label="Resultat klage tilsynet"
        name={`${klageName}.resultatKlageTilsyn`}
      />
      <TestlabFormInput<Styringsdata>
        label="Klage sendt til departementet"
        name={`${klageName}.klageDatoDepartement`}
        type="date"
      />
      <TestlabFormSelect<Styringsdata>
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

  const formMethods = useForm<Styringsdata>({
    defaultValues: {
      id: styringsdata?.id ?? undefined,
      kontrollId: kontrollId,
      loeysingId: loeysingId,
      reaksjon: styringsdata?.reaksjon ?? 'ingen-reaksjon',
      paaleggReaksjon: styringsdata?.paaleggReaksjon ?? 'ingen-reaksjon',
      paaleggKlageReaksjon:
        styringsdata?.paaleggKlageReaksjon ?? 'ingen-reaksjon',
      botReaksjon: styringsdata?.botReaksjon ?? 'ingen-reaksjon',
      botKlageReaksjon: styringsdata?.botKlageReaksjon ?? 'ingen-reaksjon',
      ...styringsdata,
    },
    mode: 'onBlur',
    resolver: zodResolver(styringsdataValidationSchema),
  });

  const { watch, formState } = formMethods;

  const onSubmit = (data: Styringsdata) => {
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

  const [
    reaksjon,
    paaleggReaksjon,
    paaleggKlageReaksjon,
    botReaksjon,
    botKlageReaksjon,
  ] = watch([
    'reaksjon',
    'paaleggReaksjon',
    'paaleggKlageReaksjon',
    'botReaksjon',
    'botKlageReaksjon',

    'bot.oekningType',
  ]);

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
        <TestlabForm<Styringsdata>
          formMethods={formMethods}
          onSubmit={onSubmit}
          className={classes.styringsdataForm}
          hasRequiredFields
        >
          <input type="hidden" {...register('id' as const)} />
          <TestlabFormInput<Styringsdata>
            label="Ansvarleg"
            name="ansvarleg"
            required
          />
          <TestlabFormInput<Styringsdata>
            label="Oppretta"
            name="oppretta"
            type="date"
            required
          />
          <TestlabFormInput<Styringsdata>
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
          <TestlabFormSelect<Styringsdata>
            label="Aktivitet"
            description="Er det forventet å bruke reaksjoner til denne løsningen?"
            options={reaksjonOptions}
            name="reaksjon"
            radio
          />
          {reaksjon === 'reaksjon' && (
            <Accordion color="first" border>
              <Accordion.Item>
                <Accordion.Header level={3}>Pålegg</Accordion.Header>
                <Accordion.Content>
                  <TestlabFormSelect
                    options={reaksjonOptions}
                    label="Skal det gis pålegg om retting"
                    name="paaleggReaksjon"
                    radio
                  />
                  {paaleggReaksjon === 'reaksjon' && (
                    <>
                      <input
                        type="hidden"
                        {...register('paalegg.id' as const)}
                      />
                      <TestlabFormInput<Styringsdata>
                        label="Pålegg vedtak dato"
                        name="paalegg.vedtakDato"
                        type="date"
                      />
                      <TestlabFormInput<Styringsdata>
                        label="Pålegg frist"
                        name="paalegg.frist"
                        type="date"
                      />
                    </>
                  )}
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header level={3}>Pålegg klage</Accordion.Header>
                <Accordion.Content>
                  <TestlabFormSelect
                    options={reaksjonOptions}
                    label="Er det klage på pålegg?"
                    name="paaleggKlageReaksjon"
                    radio
                  />
                  {paaleggKlageReaksjon === 'reaksjon' && (
                    <KlageInputs klageType={'paalegg'} register={register} />
                  )}
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header level={3}>Bot</Accordion.Header>
                <Accordion.Content>
                  <TestlabFormSelect
                    options={reaksjonOptions}
                    label="Skal det gis bot (tvangsmulkt)?"
                    name="botReaksjon"
                    radio
                  />
                  {botReaksjon === 'reaksjon' && (
                    <>
                      <input type="hidden" {...register('bot.id' as const)} />

                      <TestlabFormInput<Styringsdata>
                        label="Bot (tvangsmulkt) beløp"
                        name="bot.beloepDag"
                      />
                      <TestlabFormInput<Styringsdata>
                        label="Antall dager før økning"
                        name="bot.oekingEtterDager"
                      />
                      <div className={classes.oekingType}>
                        <TestlabFormInput<Styringsdata>
                          label="Økning pr dag"
                          name="bot.oekingSats"
                        />
                        <TestlabFormSelect<Styringsdata>
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
                      <TestlabFormInput<Styringsdata>
                        label="Når ble vedtak om bot iverksatt?"
                        name="bot.vedtakDato"
                        type="date"
                      />
                      <TestlabFormInput<Styringsdata>
                        label="Startdato for bot"
                        name="bot.startDato"
                        type="date"
                      />
                      <TestlabFormInput<Styringsdata>
                        label="Sluttdato for bot"
                        name="bot.sluttDato"
                        type="date"
                      />
                      <TestlabFormTextArea<Styringsdata>
                        label="Kommentar"
                        name="bot.kommentar"
                      />
                    </>
                  )}
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header level={3}>Bot klage</Accordion.Header>
                <Accordion.Content>
                  <TestlabFormSelect
                    options={reaksjonOptions}
                    label="Er det klage på bot?"
                    name="botKlageReaksjon"
                    radio
                  />
                  {botKlageReaksjon === 'reaksjon' && (
                    <KlageInputs klageType={'bot'} register={register} />
                  )}
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
            <SaveButton />
          </div>
        </TestlabForm>
      </div>
    </div>
  );
};

export default StyringsdataForm;
