import TestlabForm from '@common/form/TestlabForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { Testregel } from '@testreglar/api/types';
import { ElementResultat, ResultatManuellKontroll } from '@test/api/types';
import { TestResultUpdate } from '@test/types';
import { Heading } from '@digdir/designsystemet-react';
import DOMPurify from 'dompurify';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import styles from '@test/testregel-form/test-form.module.scss';
import {
  TestformForenklaFormValues,
  testformForenklaValidationSchema,
} from '@test/testregel-form/testform-forenkla/testformForenklaValidationSchema';
import { TestregelResultat } from '@test/util/testregelParser';

interface Props {
  testregel: Testregel;
  resultater: ResultatManuellKontroll[];
  showHelpText: boolean;
  onResultat: (testResultUpdate: TestResultUpdate) => void;
  slettTestelement?: (resultatId: number) => void;
  isLoading?: boolean;
  isDemoApp?: boolean;
  onCreateForenklaResultat?: (resultat: ResultatManuellKontroll) => void;
}

const TestFormForenkla = (props: Props) => {
  if (props.testregel.definition === undefined) {
    throw new Error('definition er tomt');
  }

  if (props.testregel.definition.utfall.length === 0) {
    throw new Error('definition.utfall er tomt');
  }

  const defaultUtfallIndex =
    props.testregel.definition.utfall.findIndex((u) => u.default) >= 0
      ? props.testregel.definition.utfall.findIndex((u) => u.default)
      : 0;

  const eksisterandeResultat =
    props.resultater[0] ??
    createForenklaBaseResultat({
      testregelId: props.testregel.id,
    });

  const formMethods = useForm<TestformForenklaFormValues>({
    defaultValues: {
      id: eksisterandeResultat.id,
      testgrunnlagId: eksisterandeResultat.testgrunnlagId,
      loeysingId: eksisterandeResultat.loeysingId,
      testregelId: eksisterandeResultat.testregelId,
      sideutvalId: eksisterandeResultat.sideutvalId,
      status: eksisterandeResultat.status,
      sistLagra: eksisterandeResultat.sistLagra,
      svar:
        eksisterandeResultat.svar.length > 0 ? eksisterandeResultat.svar : undefined,
      kommentar: eksisterandeResultat.kommentar,
      valgtUtfallIndex: defaultUtfallIndex,
    },
    resolver: zodResolver(testformForenklaValidationSchema),
  });

  const cleanHTML = DOMPurify.sanitize(props.testregel.kravTilSamsvar ?? '', {
    USE_PROFILES: { html: true },
  });
  const kravTilSamsvar = { __html: cleanHTML };

  const cleanInstruksjon = DOMPurify.sanitize(
    props.testregel.definition.description ?? '',
    {
      USE_PROFILES: { html: true },
    }
  );

  const instruksjon = { __html: cleanInstruksjon };

  const utfallOptions = useMemo(
    () =>
      props.testregel.definition!.utfall.map((utfall, index) => ({
        label: utfall.beskrivelse,
        value: index,
      })),
    [props.testregel.definition]
  );

  const onSubmit = (values: TestformForenklaFormValues) => {
    const utfall = props.testregel.definition!.utfall[values.valgtUtfallIndex];
    if (!utfall) {
      return;
    }

    const oppdatertResultat: ResultatManuellKontroll = {
      ...eksisterandeResultat,
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
      resultat: mapToTestregelResultat(utfall.testresultat, utfall.beskrivelse),
    });
  };

  return (
    <div className={styles.testForm}>
      <Heading data-size="md" level={3}>
        {props.testregel.namn}
      </Heading>

      <TestlabForm<TestformForenklaFormValues>
        onSubmit={onSubmit}
        formMethods={formMethods}
        hasRequiredFields={false}
        className={styles.testFormContent}
      >
        <div
          className={styles.testFormDescription}
          dangerouslySetInnerHTML={{
            __html: props.showHelpText ? kravTilSamsvar.__html : '',
          }}
        ></div>
        <div
          className={styles.testFormDescription}
          dangerouslySetInnerHTML={instruksjon}
        ></div>

        <TestlabForm.FormSelect<TestformForenklaFormValues>
          label="Vel utfall"
          name="valgtUtfallIndex"
          options={utfallOptions}
          required
        />

        <TestlabForm.FormInput<TestformForenklaFormValues>
          label="Kommentar"
          name="kommentar"
        />

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
    fasit:
      testresultat === 'samsvar'
        ? 'Ja'
        : testresultat === 'brot'
          ? 'Nei'
          : 'Ikkje testbart',
  };
}

function createForenklaBaseResultat({
  testregelId,
}: {
  testregelId: number;
}): ResultatManuellKontroll {
  return {
    id: 0,
    svar: [],
    status: 'UnderArbeid',
    testgrunnlagId: 0,
    loeysingId: 0,
    testregelId,
    sideutvalId: 0,
    sistLagra: new Date().toISOString(),
  };
}

export default TestFormForenkla;


