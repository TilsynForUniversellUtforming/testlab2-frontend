import TestlabFormInput from '@common/form/TestlabFormInput';
import TestlabFormSelect from '@common/form/TestlabFormSelect';
import { ButtonVariant } from '@common/types';
import { Button } from '@digdir/designsystemet-react';
import CrawlParameters from '@maaling/form/form/steps/init/CrawlParameters';
import { MaalingContext, MaalingFormState } from '@maaling/types';
import { CogIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const InitContentForenklet = () => {
  const { advisors }: MaalingContext = useOutletContext();

  const [displayAdvanced, setDisplayAdvanced] = useState(false);

  const toggleAdvancedDisplay = () => {
    setDisplayAdvanced(!displayAdvanced);
  };

  return (
    <>
      <TestlabFormInput<MaalingFormState>
        label="Tittel"
        description="Angi sakstype og årstall. Ta med namn på verksemd
når saka berre gjeld éi løysing/verksemd. Eksempel: Tilsyn 2023 Andeby."
        name="navn"
        required
      />
      <TestlabFormSelect<MaalingFormState>
        label="Sakshandsamar"
        description="Angi kven som skal følgje opp saka."
        name="advisorId"
        options={advisors.map((a) => ({
          label: a.name,
          value: String(a.id),
        }))}
        required
      />
      <TestlabFormInput<MaalingFormState>
        label="Saksnummer"
        description="Angi saksnummer frå Websak. Eksempel: 23/297."
        name="sakNumber"
      />
      <Button
        title="Avanserte instillinger"
        variant={ButtonVariant.Quiet}
        onClick={toggleAdvancedDisplay}
      >
        <CogIcon />
        Avansert
      </Button>
      <CrawlParameters displayAdvanced={displayAdvanced} />
    </>
  );
};

export default InitContentForenklet;
