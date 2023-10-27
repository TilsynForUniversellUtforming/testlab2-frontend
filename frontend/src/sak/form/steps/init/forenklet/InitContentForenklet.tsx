import TestlabFormInput from '@common/form/TestlabFormInput';
import TestlabFormSelect from '@common/form/TestlabFormSelect';
import { ButtonVariant } from '@common/types';
import { Button } from '@digdir/design-system-react';
import { CogIcon } from '@navikt/aksel-icons';
import SakCrawlParameters from '@sak/form/steps/init/forenklet/SakCrawlParameters';
import { SakFormState } from '@sak/types';
import { useState } from 'react';

import { User } from '../../../../../user/api/types';

interface Props {
  advisors: User[];
}

const InitContentForenklet = ({ advisors }: Props) => {
  const [displayAdvanced, setDisplayAdvanced] = useState(false);

  const toggleAdvancedDisplay = () => {
    setDisplayAdvanced(!displayAdvanced);
  };

  return (
    <>
      <TestlabFormInput<SakFormState>
        label="Tittel"
        sublabel="Angi sakstype og årstall. Ta med namn på verksemd
når saka berre gjeld éi løysing/verksemd. Eksempel: Tilsyn 2023 Andeby."
        name="navn"
        required
      />
      <TestlabFormSelect<SakFormState>
        label="Sakshandsamar"
        sublabel="Angi kven som skal følgje opp saka."
        name="advisorId"
        options={advisors.map((a) => ({
          label: a.name,
          value: String(a.id),
        }))}
        required
      />
      <TestlabFormInput<SakFormState>
        label="Saksnummer"
        sublabel="Angi saksnummer frå Websak. Eksempel: 23/297."
        name="sakNumber"
      />
      <Button
        title="Avanserte instillinger"
        icon={<CogIcon />}
        variant={ButtonVariant.Quiet}
        iconPlacement={'right'}
        onClick={toggleAdvancedDisplay}
      >
        Avansert
      </Button>
      <SakCrawlParameters displayAdvanced={displayAdvanced} />
    </>
  );
};

export default InitContentForenklet;
