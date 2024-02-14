import TestlabFormInput from '@common/form/TestlabFormInput';
import TestlabFormSelect from '@common/form/TestlabFormSelect';
import { ButtonVariant } from '@common/types';
import { Button } from '@digdir/design-system-react';
import { CogIcon } from '@navikt/aksel-icons';
import SakCrawlParameters from '@sak/form/steps/init/forenklet/SakCrawlParameters';
import { SakContext, SakFormState } from '@sak/types';
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const InitContentForenklet = () => {
  const { advisors }: SakContext = useOutletContext();

  const [displayAdvanced, setDisplayAdvanced] = useState(false);

  const toggleAdvancedDisplay = () => {
    setDisplayAdvanced(!displayAdvanced);
  };

  return (
    <>
      <TestlabFormInput<SakFormState>
        label="Tittel"
        description="Angi sakstype og årstall. Ta med namn på verksemd
når saka berre gjeld éi løysing/verksemd. Eksempel: Tilsyn 2023 Andeby."
        name="navn"
        required
      />
      <TestlabFormSelect<SakFormState>
        label="Sakshandsamar"
        description="Angi kven som skal følgje opp saka."
        name="advisorId"
        options={advisors.map((a) => ({
          label: a.name,
          value: String(a.id),
        }))}
        required
      />
      <TestlabFormInput<SakFormState>
        label="Saksnummer"
        description="Angi saksnummer frå Websak. Eksempel: 23/297."
        name="sakNumber"
      />
      <Button
        title="Avanserte instillinger"
        variant={ButtonVariant.Quiet}
        iconPlacement={'right'}
        onClick={toggleAdvancedDisplay}
      >
        <CogIcon />
        Avansert
      </Button>
      <SakCrawlParameters displayAdvanced={displayAdvanced} />
    </>
  );
};

export default InitContentForenklet;
