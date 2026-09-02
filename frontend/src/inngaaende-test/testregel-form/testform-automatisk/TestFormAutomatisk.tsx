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
import TestlabFormTextArea from '@common/form/TestlabFormTextArea';
import {
  TestformAutomatiskFormValues
} from '@test/testregel-form/testform-automatisk/testformAutomatiskValidationSchema';
import {useTestFormAutomatiskFormOptions} from "@test/testregel-form/testform-automatisk/hooks";
import {
  mapToTestregelResultat,
  mapUtfallToElementResultat,
} from '@test/testregel-form/utils';

interface Props {
  testregel: Testregel;
  showHelpText: boolean;
  onResultat: (testResultUpdate: TestResultUpdate) => void;
  slettTestelement?: (resultatId: number) => void;
  isLoading?: boolean;
  isDemoApp?: boolean;
  onCreateForenklaResultat?: (resultat: ResultatManuellKontroll) => void;
  activeResult: ResultatManuellKontroll;
}

const TestFormAutomatisk = (props: Props) => {
  if (props.testregel.testregelSchema === undefined) {
    throw new Error('definition er tomt');
  }

  const formMethods = useTestFormAutomatiskFormOptions(props.activeResult);

  const sucsessFullSubmit = formMethods.formState.isSubmitSuccessful;


  const onSubmit = (values: TestformAutomatiskFormValues) => {

    const utfall = mapUtfallToElementResultat(values['elementResultat']);


    const oppdatertResultat: ResultatManuellKontroll = {
      ...props.activeResult,
      ...values,
      elementResultat: utfall,
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
      resultat: mapToTestregelResultat(values['elementResultat'], values['elementUtfall']),
    });
  };

  const description = formMethods.getValues('elementOmtale');

  return (
    <div className={styles.testForm}>
      <TestlabForm<TestformAutomatiskFormValues>
        onSubmit={onSubmit}
        formMethods={formMethods}
        hasRequiredFields={false}
        className={styles.testFormContent}
      >

        <fieldset className={styles.testFormFields}>
          <TestlabForm.FormInput<TestformAutomatiskFormValues>
            label={'Beskriv elementet'}
            name="elementOmtale"
            required={true}
          />

          <TestlabFormTextArea<TestformAutomatiskFormValues>
            label={'Element kjeldekode'}
            name="elementOmtaleHtml"
            required={false}
          />

          <TestlabForm.FormInput<TestformAutomatiskFormValues>
            label={'Utfall'}
            name="elementResultat"
            required={true}
          />

          <TestlabForm.FormInput<TestformAutomatiskFormValues>
            label={'Resultat'}
            name="elementUtfall"
            required={true}
          />

          <TestlabFormTextArea<TestformAutomatiskFormValues>
            label="Kommentar"
            name="kommentar"
          />
        </fieldset>

        {sucsessFullSubmit && (
          <StatusMessageBox statusmessage={'Lagra ' + description} />
        )}

        <TestlabForm.FormButtons />
      </TestlabForm>
    </div>
  );
};


export default TestFormAutomatisk;
