import TestlabForm from '@common/form/TestlabForm';
import { createOptionsFromLiteral } from '@common/util/stringutils';
import { Testregel } from '@testreglar/api/types';
import { ResultatManuellKontroll } from '@test/api/types';
import { TestResultUpdate } from '@test/types';
import { Details } from '@digdir/designsystemet-react';
import DOMPurify from 'dompurify';
import styles from '@test/testregel-form/test-form.module.scss';
import {
  customUtfallValue,
  TestformForenklaFormValues,
} from '@test/testregel-form/testform-forenkla/testformForenklaValidationSchema';
import {
  useTestFormForenklaFormOptions,
  useUtfallOption,
} from '@test/testregel-form/testform-forenkla/hooks';
import StatusMessageBox from '@test/test-overview/loeysing-test/StatusMessageBox';
import TestlabFormTextArea from '@common/form/TestlabFormTextArea';
import {
  mapToTestregelResultat,
  mapUtfallToElementResultat,
} from '@test/testregel-form/utils';
import ImageUpload from '@common/image-edit/ImageUpload';
import { TestElementFooter } from '@test/testregel-form/TestElementFooter';
import { useMemo } from 'react';

interface Props {
  testregel: Testregel;
  showHelpText: boolean;
  onResultat: (testResultUpdate: TestResultUpdate) => void;
  slettTestelement: (resultatId: number) => void;
  isLoading: boolean;
  isDemoApp: boolean;
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

  const successFullSubmit = formMethods.formState.isSubmitSuccessful


  const helptext = sanitizeHelptext(props);
  const instruksjon = sanitizeInstruksjon(props);

  const utfallOptions = useUtfallOption(props.testregel.definition.utfall);
  const utfallOptionsWithCustom = useMemo(
    () => [
      ...utfallOptions,
      {
        label: 'Eigendefinert utfall',
        value: customUtfallValue,
      },
    ],
    [utfallOptions]
  );

  const customUtfallTestresultatOptions = useMemo(() => {
    const availableUtfallTypes = Array.from(
      new Set(
        props.testregel.definition!.utfall
          .map((utfall) => utfall.testresultat)
          .concat(props.activeResult.elementResultat ?? [])
      )
    );

    return createOptionsFromLiteral(availableUtfallTypes);
  }, [props.activeResult.elementResultat, props.testregel.definition]);
  const valgtUtfallIndex = formMethods.watch('valgtUtfallIndex');


  const erEigendefinertUtfall = valgtUtfallIndex === customUtfallValue;

  const onSubmit = (values: TestformForenklaFormValues) => {
    let testresultat: string;
    let beskrivelse: string;
    let utfallId: number | undefined = undefined;

    if (values.valgtUtfallIndex === customUtfallValue) {
      if (!values.customUtfallTestresultat || !values.customUtfallBeskrivelse) {
        return;
      }

      testresultat = values.customUtfallTestresultat;
      beskrivelse = values.customUtfallBeskrivelse;
    } else {
      const utfall = props.testregel.definition!.utfall[values.valgtUtfallIndex];
      if (!utfall) {
        return;
      }

      testresultat = utfall.testresultat;
      beskrivelse = utfall.beskrivelse;
      utfallId = utfall.id;
    }

    const oppdatertResultat: ResultatManuellKontroll = {
      ...props.activeResult,
      kommentar: values.kommentar,
      elementOmtale: values.elementOmtale,
      elementOmtaleHtml: values.elementOmtaleHtml,
      elementResultat: mapUtfallToElementResultat(testresultat),
      elementUtfall: beskrivelse,
      svar: values.svar ?? [],
      sistLagra: new Date().toISOString(),
      status: 'Ferdig',
      elementUtfallId: utfallId ?? null,
    };

    props.onCreateForenklaResultat?.(oppdatertResultat);
    props.onResultat({
      resultatId: oppdatertResultat.id,
      alleSvar: oppdatertResultat.svar,
      kommentar: oppdatertResultat.kommentar,
      elementOmtale: oppdatertResultat.elementOmtale,
      elementOmtaleHtml: oppdatertResultat.elementOmtaleHtml,
      resultat: mapToTestregelResultat(testresultat, beskrivelse,utfallId ?? null),
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

          <TestlabFormTextArea<TestformForenklaFormValues>
            label={'Element kjeldekode'}
            name="elementOmtaleHtml"
            required={false}
          />

          <TestlabForm.FormSelect<TestformForenklaFormValues>
            label="Vel utfall"
            name="valgtUtfallIndex"
            options={utfallOptionsWithCustom}
            required
          />

          {erEigendefinertUtfall && (
            <fieldset className={styles.testFormCustomUtfallGroup}>
              <legend className={styles.testFormCustomUtfallLegend}>
                Eigendefinert utfall
              </legend>
              <p className={styles.testFormCustomUtfallDescription}>
                Fyll ut resultat og skildring for det eigendefinerte utfallet.
              </p>

              <TestlabForm.FormSelect<TestformForenklaFormValues>
                label="Vel resultat for eigendefinert utfall"
                name="customUtfallTestresultat"
                options={customUtfallTestresultatOptions}
                required
              />

              <TestlabForm.FormInput<TestformForenklaFormValues>
                label="Beskriv eigendefinert utfall"
                name="customUtfallBeskrivelse"
                required
              />
            </fieldset>
          )}

          <TestlabFormTextArea<TestformForenklaFormValues>
            label="Kommentar"
            name="kommentar"
          />
        </fieldset>
        <ImageUpload resultatId={props.activeResult.id} isDemo={props.isDemoApp} />

        {successFullSubmit && (
          <StatusMessageBox statusmessage={'Lagra ' + description} />
        )}

        <TestElementFooter
          slettTestelement={props.slettTestelement}
          resultatId={props.activeResult.id}
          isLoading={props.isLoading}
        />

        <TestlabForm.FormButtons />
      </TestlabForm>
    </div>
  );
};




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
