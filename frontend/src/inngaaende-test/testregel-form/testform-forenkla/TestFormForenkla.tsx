import TestlabForm from '@common/form/TestlabForm';
import { Testregel } from '@testreglar/api/types';
import { ElementResultat, ResultatManuellKontroll } from '@test/api/types';
import { TestResultUpdate } from '@test/types';
import { Details, Heading } from '@digdir/designsystemet-react';
import DOMPurify from 'dompurify';
import { useMemo } from 'react';
import styles from '@test/testregel-form/test-form.module.scss';
import { TestformForenklaFormValues } from '@test/testregel-form/testform-forenkla/testformForenklaValidationSchema';
import { TestregelResultat } from '@test/util/testregelParser';
import {
  useTestFormForenklaFormOptions,
  useUtfallOption,
} from '@test/testregel-form/testform-forenkla/hooks';
import StatusMessageBox from '@test/test-overview/loeysing-test/StatusMessageBox';

interface Props {
  testregel: Testregel;
  showHelpText: boolean;
  onResultat: (testResultUpdate: TestResultUpdate) => void;
  slettTestelement?: (resultatId: number) => void;
  isLoading?: boolean;
  isDemoApp?: boolean;
  onCreateForenklaResultat?: (resultat: ResultatManuellKontroll) => void;
  activeResult:ResultatManuellKontroll
}


const TestFormForenkla = (props: Props) => {
  if (props.testregel.definition === undefined) {
    throw new Error('definition er tomt');
  }

  if (props.testregel.definition.utfall.length === 0) {
    throw new Error('definition.utfall er tomt');
  }

  const formMethods = useTestFormForenklaFormOptions(
    props.activeResult,
    props.testregel.definition.utfall
  );

  const sucsessFullSubmit = formMethods.formState.isSubmitSuccessful


  const helptext = sanitizeHelptext(props);
  const instruksjon = sanitizeInstruksjon(props);

  const utfallOptions = useUtfallOption(props.testregel.definition.utfall);

  const onSubmit = (values: TestformForenklaFormValues) => {
    const utfall = props.testregel.definition!.utfall[values.valgtUtfallIndex];
    if (!utfall) {
      return;
    }

    const oppdatertResultat: ResultatManuellKontroll = {
      ...props.activeResult,
      ...values,
      elementResultat: mapUtfallToElementResultat(utfall.testresultat),
      elementUtfall: utfall.beskrivelse,
      svar: values.svar ?? [],
      sistLagra: new Date().toISOString(),
      status: 'Ferdig',
    };

    props.onCreateForenklaResultat?.(oppdatertResultat);
    props.onResultat({
      resultatId: oppdatertResultat.id,
      alleSvar: oppdatertResultat.svar,
      kommentar: oppdatertResultat.kommentar,
      elementOmtale: oppdatertResultat.elementOmtale,
      elementOmtaleHtml: oppdatertResultat.elementOmtaleHtml,
      resultat: mapToTestregelResultat(utfall.testresultat, utfall.beskrivelse),
    });
  };

  const description = formMethods.getValues("elementOmtale")

  return (
    <div className={styles.testForm}>
      <TestlabForm<TestformForenklaFormValues>
        onSubmit={onSubmit}
        formMethods={formMethods}
        hasRequiredFields={false}
        className={styles.testFormContent}
      >
        <div
          className={styles.testFormDescription}
          dangerouslySetInnerHTML={instruksjon}
        ></div>
        <Details>
          <Details.Summary className={styles.testFormHelptext}>
            Hjelpetekst
          </Details.Summary>
          <div
            className={styles.testFormDescription}
            dangerouslySetInnerHTML={{
              __html: props.showHelpText ? helptext.__html : '',
            }}
          ></div>
        </Details>

        <fieldset className={styles.testFormFields}>
          <TestlabForm.FormInput<TestformForenklaFormValues>
            label={'Beskriv elementet'}
            name="elementOmtale"
            required={true}
          />

          <TestlabForm.FormSelect<TestformForenklaFormValues>
            label="Vel utfall"
            name="valgtUtfallIndex"
            options={utfallOptions}
            radio={true}
            required
          />

          <TestlabForm.FormInput<TestformForenklaFormValues>
            label="Kommentar"
            name="kommentar"
          />
        </fieldset>

        {sucsessFullSubmit && <StatusMessageBox
          statusmessage={'Lagra ' + description}
        />}

        <TestlabForm.FormButtons />
      </TestlabForm>
    </div>
  );
};

function mapUtfallToElementResultat(testresultat: string): ElementResultat {
  switch (testresultat) {
    case 'samsvar':
      return 'samsvar';
    case 'brot':
      return 'brot';
    case 'ikkje-forekomst':
      return 'ikkjeForekomst';
    case 'ikkje-testbar':
      return 'ikkjeTesta';
    default:
      return 'advarsel';
  }
}

function mapToTestregelResultat(
  testresultat: string,
  utfall: string
): TestregelResultat {
  if (testresultat === 'ikkje-forekomst') {
    return { type: 'ikkjeForekomst', utfall };
  }

  return {
    type: 'avslutt',
    utfall,
    fasit: mapTestresultatToFasit(testresultat),
  };
}

function mapTestresultatToFasit(
  testresultat: string
): 'Ja' | 'Nei' | 'Ikkje testbart' {
  switch (testresultat) {
    case 'samsvar':
      return 'Ja';
    case 'brot':
      return 'Nei';
    default:
      return 'Ikkje testbart';
  }
}
function sanitizeHelptext(props: Props) {
  const cleanHTML = DOMPurify.sanitize(
    props.testregel.definition?.helptext ?? '',
    {
      USE_PROFILES: { html: true },
    }
  );

  return { __html: cleanHTML };
}
function sanitizeInstruksjon(props: Props) {
  const cleanInstruksjon = DOMPurify.sanitize(
    props.testregel.definition?.description ?? '',
    {
      USE_PROFILES: { html: true },
    }
  );

  return { __html: cleanInstruksjon };
}

export default TestFormForenkla;
