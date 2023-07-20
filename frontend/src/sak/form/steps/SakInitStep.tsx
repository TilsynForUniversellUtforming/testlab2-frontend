import { Button } from '@digdir/design-system-react';
import { CogIcon } from '@navikt/aksel-icons';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { TestlabFormButtonStep } from '../../../common/form/TestlabFormButtons';
import TestlabFormInput from '../../../common/form/TestlabFormInput';
import TestlabFormSelect from '../../../common/form/TestlabFormSelect';
import { User } from '../../../user/api/types';
import { SakFormBaseProps, SakFormState, saktypeOptions } from '../../types';
import SakStepFormWrapper from '../SakStepFormWrapper';
import SakCrawlParameters from './loeysing/SakCrawlParameters';

const SakInitStep = ({
  formStepState,
  maalingFormState,
  onSubmit,
  advisors,
}: SakFormBaseProps & { advisors: User[] }) => {
  const navigate = useNavigate();
  const [displayAdvanced, setDisplayAdvanced] = useState(false);

  const formMethods = useForm<SakFormState>({
    defaultValues: maalingFormState,
  });

  const buttonStep: TestlabFormButtonStep = {
    stepType: 'Start',
    onClickBack: () => navigate('/'),
  };

  const toggleAdvancedDisplay = () => {
    setDisplayAdvanced(!displayAdvanced);
  };

  return (
    <SakStepFormWrapper
      formStepState={formStepState}
      onSubmit={onSubmit}
      formMethods={formMethods}
      buttonStep={buttonStep}
    >
      <div className="sak-init">
        <TestlabFormSelect<SakFormState>
          label="Type sak"
          sublabel="Angi type sak du skal opprette."
          name="sakType"
          options={saktypeOptions}
          formValidation={{
            errorMessage: 'Type sak må vejast',
            validation: { required: true },
          }}
        />
        <TestlabFormInput<SakFormState>
          label="Tittel"
          sublabel="Angi sakstype og årstall. Ta med namn på verksemd
når saka berre gjeld éi løysing/verksemd. Eksempel: Tilsyn 2023 Andeby."
          name="navn"
          formValidation={{
            errorMessage: 'Tittel kan ikkje væra tom',
            validation: { required: true, minLength: 1 },
          }}
        />
        <TestlabFormSelect<SakFormState>
          label="Sakshandsamar"
          sublabel="Angi kven som skal følgje opp saka."
          name="advisorId"
          options={advisors.map((a) => ({
            label: a.name,
            value: String(a.id),
          }))}
          formValidation={{
            errorMessage: 'Sakshandsamar kan ikkje væra tom',
            validation: { required: true, minLength: 1 },
          }}
        />
        <TestlabFormInput<SakFormState>
          label="Saksnummer (valfritt)"
          sublabel="Angi saksnummer frå Websak. Eksempel: 23/297."
          name="sakNumber"
        />
        <Button
          title="Avansert"
          icon={<CogIcon />}
          variant={'quiet'}
          iconPlacement={'right'}
          onClick={toggleAdvancedDisplay}
        >
          Avansert
        </Button>
        {displayAdvanced && <SakCrawlParameters />}
      </div>
    </SakStepFormWrapper>
  );
};

export default SakInitStep;
