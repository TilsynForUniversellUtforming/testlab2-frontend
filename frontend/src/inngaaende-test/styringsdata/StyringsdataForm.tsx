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
      <input type="hidden" value={klageType} name={`${klageName}.klageType`} />
      <TestlabFormInput<Styringsdata> label="Klage mottatt dato" name={`${klageName}.klageMottattDato`} type="date" required />
      <TestlabFormInput<Styringsdata> label="Klage avgjort dato" name={`${klageName}.klageAvgjortDato`} type="date" />
      <TestlabFormSelect<Styringsdata> options={options} label="Resultat klage tilsynet" name={`${klageName}.resultatKlageTilsyn`} />
      <TestlabFormInput<Styringsdata> label="Klage mottatt departement dato" name={`${klageName}.klageDatoDepartement`} type="date" />
      <TestlabFormSelect<Styringsdata> options={options} label="Resultat klage departement" name={`${klageName}.resultatKlageDepartement`} />
    </>
    )
}

const StyringsdataForm = () => {

  const { kontroll, styringsdata } = useLoaderData() as StyringsdataLoaderData;
  const formMethods = useForm<Styringsdata>({
    defaultValues: {
      ansvarlig: styringsdata?.ansvarlig ?? '',
      opprettet: styringsdata?.opprettet,
      frist: styringsdata?.frist,
      reaksjon: styringsdata?.reaksjon ?? false,
      bot: styringsdata?.bot ?? undefined,
      botKlage: styringsdata?.botKlage ?? undefined,
      paalegg: styringsdata?.paalegg ?? undefined,
      paaleggKlage: styringsdata?.paaleggKlage ?? undefined
    },
    mode: 'onBlur',
    resolver: zodResolver(styringsdataValidationSchema),
  });

  const { watch, formState } = formMethods;

  const onSubmit = (data: Styringsdata) => {
    console.log(data)
  }

  const reaksjon = watch("reaksjon", false);

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
        <TestlabFormInput<Styringsdata> label="Ansvarlig" name="ansvarlig" required/>
        <TestlabFormInput<Styringsdata> label="Opprettet" name="opprettet" type="date" required/>
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
          options={[{ value: 'true', label: 'Ja' }, { value: 'false', label: 'Nei' }]}
          name="reaksjon" radio/>
        {String(reaksjon) === 'true' && <Accordion
          color="first"
          border
        >
          <Accordion.Item>
            <Accordion.Header level={3}>
              Pålegg
            </Accordion.Header>
            <Accordion.Content>
              <TestlabFormInput<Styringsdata> label="Pålegg vedtak dato" name="paalegg.vedtakDato" type="date"
                                              required/>
              <TestlabFormInput<Styringsdata> label="Pålegg frist" name="paalegg.frist" type="date" required/>
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
              <TestlabFormInput<Styringsdata> label="Tvangsmulkt beløp" name="bot.beloepDag" required/>
              <TestlabFormInput<Styringsdata> label="Antall dager før økning" name="bot.oekingEtterDater" required/>
              <div className={classes.oekingType}>
                <TestlabFormInput<Styringsdata> label="Økning pr dag" name="bot.oekingSats" required/>
                <TestlabFormSelect<Styringsdata>
                  label={''}
                  options={[{ value: 'kroner', label: 'NOK' }, { value: 'prosent', label: '%' }]}
                  name="bot.oekningType" radio radioInline/>
              </div>
              <TestlabFormInput<Styringsdata> label="Når ble vedtak om mulkt iverksatt?" name="bot.vedakDato" required/>
              <TestlabFormInput<Styringsdata> label="Startdato for mulkt" name="bot.startDato" required/>
              <TestlabFormInput<Styringsdata> label="Sluttdato for tvangsmulkt" name="bot.sluttDato" required/>
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