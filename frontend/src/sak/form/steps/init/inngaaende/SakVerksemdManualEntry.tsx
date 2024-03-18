import TestlabDivider from '@common/divider/TestlabDivider';
import TestlabFormInput from '@common/form/TestlabFormInput';
import { Heading } from '@digdir/designsystemet-react';
import { SakFormState } from '@sak/types';

const SakVerksemdManualEntry = () => (
  <>
    <TestlabDivider size="small" />
    <Heading level={5} size="xsmall" spacing>
      Legg inn informasjon manuelt
    </Heading>
    <TestlabFormInput<SakFormState>
      label="Namn på verksemd"
      name="verksemdLoeysingRelation.manualVerksemd.namn"
    />
    <TestlabFormInput<SakFormState>
      label="Organisasjonsnummer"
      name="verksemdLoeysingRelation.manualVerksemd.orgnummer"
    />
    <TestlabFormInput<SakFormState>
      label="Dagleg leiar"
      name="verksemdLoeysingRelation.manualVerksemd.ceo"
    />
    <TestlabFormInput<SakFormState>
      label="Kontaktperson"
      name="verksemdLoeysingRelation.manualVerksemd.contactPerson"
    />
  </>
);

export default SakVerksemdManualEntry;
