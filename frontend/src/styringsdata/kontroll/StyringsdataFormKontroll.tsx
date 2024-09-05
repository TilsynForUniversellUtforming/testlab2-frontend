import TestlabLinkButton from '@common/button/TestlabLinkButton';
import TestlabForm from '@common/form/TestlabForm';
import TestlabFormInput from '@common/form/TestlabFormInput';
import TestlabFormSelect from '@common/form/TestlabFormSelect';
import { ButtonVariant } from '@common/types';
import { createOptionsFromLiteral } from '@common/util/stringutils';
import { isDefined } from '@common/util/validationUtils';
import { Card, Divider, Heading, Tag } from '@digdir/designsystemet-react';
import { getIdFromParams } from '@test/util/testregelUtils';
import { useForm } from 'react-hook-form';
import { useLoaderData, useParams, useSubmit } from 'react-router-dom';

import { KONTROLL_LISTE } from '../../kontroll/KontrollRoutes';
import SaveButton from '../SaveButton';
import classes from '../styringsdata.module.css';
import {
  StyringsdataKontroll,
  StyringsdataKontrollLoaderData,
  StyringsdataKontrollStatus,
} from '../types';

const StyringsdataFormKontroll = () => {
  const { kontrollTittel, arkivreferanse, styringsdata } =
    useLoaderData() as StyringsdataKontrollLoaderData;

  const submit = useSubmit();

  const { kontrollId: kontrollIdParam } = useParams();
  const kontrollId = getIdFromParams(kontrollIdParam);

  const isEdit = isDefined(styringsdata);

  const formMethods = useForm<StyringsdataKontroll>({
    defaultValues: {
      id: styringsdata?.id ?? undefined,
      kontrollId: kontrollId,
      ...styringsdata,
    },
    mode: 'onBlur',
  });

  const onSubmit = (data: StyringsdataKontroll) => {
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

  const { register } = formMethods;

  return (
    <div className={classes.styringsdata}>
      <div className={classes.styringsdataForm}>
        <Heading level={2} size="medium" spacing>
          {' '}
          Styringsdata {kontrollTittel}
        </Heading>
        {arkivreferanse && <Tag>Arkivreferanse {arkivreferanse}</Tag>}
        <TestlabForm<StyringsdataKontroll>
          formMethods={formMethods}
          onSubmit={onSubmit}
          className={classes.styringsdataForm}
          hasRequiredFields
        >
          <Card color="second">
            <Card.Header>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Heading level={2} size="xs">
                  Oppstart
                </Heading>
              </div>
            </Card.Header>
            <Divider color="subtle" />
            <Card.Content>
              <input type="hidden" {...register('id' as const)} />
              <TestlabFormInput<StyringsdataKontroll>
                label="Ansvarleg"
                name="ansvarleg"
                required
              />
              <TestlabFormInput<StyringsdataKontroll>
                label="Oppretta"
                name="oppretta"
                type="date"
              />
              <TestlabFormInput<StyringsdataKontroll>
                label="Frist for gjennomføring"
                name="frist"
                type="date"
              />
              <TestlabFormSelect<StyringsdataKontroll>
                label="Status"
                options={createOptionsFromLiteral<StyringsdataKontrollStatus>([
                  'planlagt',
                  'paagar',
                  'avslutta',
                  'ikkje-aktuell',
                  'forsinka',
                ])}
                name="status"
              />
              <TestlabFormInput<StyringsdataKontroll>
                label="Frist for gjennomføring"
                name="varselSendtDato"
                type="date"
              />
            </Card.Content>
          </Card>
          <Card color="second">
            <Card.Header>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Heading level={2} size="xs">
                  Rapport
                </Heading>
              </div>
            </Card.Header>
            <Divider color="subtle" />
            <Card.Content>
              <TestlabFormInput<StyringsdataKontroll>
                label="Foreløpig rapport sendt"
                name="foerebelsRapportSendtDato"
                type="date"
              />
              <TestlabFormInput<StyringsdataKontroll>
                label="Svar på rapport mottatt"
                name="svarFoerebelsRapportDato"
                type="date"
              />
              <TestlabFormInput<StyringsdataKontroll>
                label="Endelig rapport dato"
                name="svarFoerebelsRapportDato"
                type="date"
              />
            </Card.Content>
          </Card>
          <Card color="second">
            <Card.Header>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Heading level={2} size="xs">
                  Avslutning
                </Heading>
              </div>
            </Card.Header>
            <Divider color="subtle" />
            <Card.Content>
              <TestlabFormInput<StyringsdataKontroll>
                label="Kontroll avsluttet dato"
                name="endeligRapportDato"
                type="date"
              />
              <TestlabFormInput<StyringsdataKontroll>
                label="Publiser resultater/rapport"
                name="kontrollAvsluttaDato"
                type="date"
              />
              <TestlabFormInput<StyringsdataKontroll>
                label="Dato for publisering av resultater"
                name="rapportPublisertDato"
                type="date"
              />
            </Card.Content>
          </Card>
          <div className={classes.buttons}>
            <TestlabLinkButton
              variant={ButtonVariant.Outline}
              route={KONTROLL_LISTE}
              title="Naviger tilbake"
            >
              Tilbake
            </TestlabLinkButton>
            <SaveButton />
          </div>
        </TestlabForm>
      </div>
    </div>
  );
};

export default StyringsdataFormKontroll;
