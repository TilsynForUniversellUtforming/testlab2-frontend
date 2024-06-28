import { useForm, } from 'react-hook-form';
import { KlageType, ResultatKlage, Styringsdata, StyringsdataLoaderData } from '@test/styringsdata/types';
import { useLoaderData } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { styringsdataValidationSchema } from '@test/styringsdata/styringsdataValidationSchema';
import TestlabForm from '@common/form/TestlabForm';
import { Accordion, Button, Heading, Paragraph, Tag } from '@digdir/designsystemet-react';
import TestlabFormInput from '@common/form/TestlabFormInput';
import TestlabFormSelect from '@common/form/TestlabFormSelect';
import { createOptionsFromLiteral } from '@common/util/stringutils';
import TestlabFormTextArea from '@common/form/TestlabFormTextArea';

import classes from './styringsdata.module.css';

const KlageInputs = ({ klageType }: { klageType: KlageType }) => {
  const klageName = klageType === 'bot' ? 'botKlage' : 'paaleggKlage';
  const options = createOptionsFromLiteral<ResultatKlage>([
    'stadfesta' , 'delvis-omgjort' , 'omgjort' , 'oppheva'
    ]);

  return (
    <>
      <TestlabFormInput<Styringsdata> label="Klage mottatt dato" name={`${klageName}.klageMottattDato`} type="date" />
      <TestlabFormInput<Styringsdata> label="Klage avgjort dato" name={`${klageName}.klageAvgjortDato`} type="date" />
      <TestlabFormSelect<Styringsdata> options={options} label="Resultat klage tilsynet" name={`${klageName}.resultatKlageTilsyn`} />
      <TestlabFormInput<Styringsdata> label="Klage sendt til departementet" name={`${klageName}.klageDatoDepartement`} type="date" />
      <TestlabFormSelect<Styringsdata> options={options} label="Resultat klage departement" name={`${klageName}.resultatKlageDepartement`} />
    </>
    )
}

const StyringsdataForm = () => {

  const { kontroll, styringsdata } = useLoaderData() as StyringsdataLoaderData;
  const formMethods = useForm<Styringsdata>({
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

  const onSubmit = (data: Styringsdata) => {
    console.log('SUBMIT:',data)
  }

  const reaksjon = watch("reaksjon", 'ingen-reaksjon');

  console.log(formState.errors)

  return (
    <div className={classes.styringsdata}>
      <div className={classes.styringsdataForm}>
        < Heading
          level={2}
          size="medium"
          spacing> Styringsdata * LØSNING *
        </Heading>
        <Paragraph spacing>Legg til styringsdata for denne løysinga</Paragraph>
        <Tag>Hei</Tag>
      <TestlabForm<Styringsdata>
        formMethods={formMethods}
        onSubmit={onSubmit}
        className={classes.styringsdataForm}
        hasRequiredFields
      >
        <TestlabFormInput<Styringsdata> label="Ansvarleg" name="ansvarleg" required/>
        <TestlabFormInput<Styringsdata> label="Oppretta" name="oppretta" type="date" required/>
        <TestlabFormInput<Styringsdata> label="Frist for gjennomføring" name="frist" type="date" required/>
        <Heading level={3} size="small">
          Saksbehandling
        </Heading>
        <Paragraph size="small" spacing>
          Ansvarleg for kontrollen kan redigera og leggja til aktivitetar i samband med kontroll av denne løysinga.
          <br/>
          Desse felta triggar inga handling, det er berre for intern oversikt. Dialog med part går føre seg i andre
          kanalar.
        </Paragraph>
        <TestlabFormSelect<Styringsdata>
          label="Aktivitet"
          description="Er det forventet å bruke reaksjoner til denne løsningen?"
          options={[{ value: 'reaksjon', label: 'Ja' }, { value: 'ingen-reaksjon', label: 'Nei' }]}
          name="reaksjon" radio/>
        {reaksjon === 'reaksjon' && <Accordion
          color="first"
          border
        >
          <Accordion.Item>
            <Accordion.Header level={3}>
              Pålegg
            </Accordion.Header>
            <Accordion.Content>
              <TestlabFormInput<Styringsdata> label="Pålegg vedtak dato" name="paalegg.vedtakDato" type="date"
                                              />
              <TestlabFormInput<Styringsdata> label="Pålegg frist" name="paalegg.frist" type="date" />
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Header level={3}>
              Pålegg klage
            </Accordion.Header>
            <Accordion.Content>
              <KlageInputs klageType={'paalegg'}/>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Header level={3}>
              Bot
            </Accordion.Header>
            <Accordion.Content>
              <TestlabFormInput<Styringsdata> label="Bot (tvangsmulkt) beløp" name="bot.beloepDag" />
              <TestlabFormInput<Styringsdata> label="Antall dager før økning" name="bot.oekingEtterDager" />
              <div className={classes.oekingType}>
                <TestlabFormInput<Styringsdata> label="Økning pr dag" name="bot.oekingSats" />
                <TestlabFormSelect<Styringsdata>
                  label={''}
                  options={[{ value: 'kroner', label: 'NOK' }, { value: 'prosent', label: '%' }]}
                  name="bot.oekningType" radio radioInline/>
              </div>
              <TestlabFormInput<Styringsdata> label="Når ble vedtak om bot iverksatt?" name="bot.vedtakDato" type="date" />
              <TestlabFormInput<Styringsdata> label="Startdato for bot" name="bot.startDato" type="date" />
              <TestlabFormInput<Styringsdata> label="Sluttdato for bot" name="bot.sluttDato" type="date" />
              <TestlabFormTextArea<Styringsdata> label="Kommentar" name="bot.kommentar"/>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Header level={3}>
              Bot klage
            </Accordion.Header>
            <Accordion.Content>
              <KlageInputs klageType={'bot'}/>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>}
        <div>
          <Button type="submit">Lagre</Button>
        </div>
      </TestlabForm>
      </div>
    </div>
  )
}

export default StyringsdataForm;