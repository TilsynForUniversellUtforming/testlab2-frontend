import { TestlabFormButtonStep } from '@common/form/TestlabFormButtons';
import TestlabFormInput from '@common/form/TestlabFormInput';
import TestlabFormSelect from '@common/form/TestlabFormSelect';
import { isNotDefined } from '@common/util/util';
import { Button } from '@digdir/design-system-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { CogIcon } from '@navikt/aksel-icons';
import { sakInitValidationSchema } from '@sak/form/steps/sakFormValidationSchema';
import { SakFormBaseProps, SakFormState, saktypeOptions } from '@sak/types';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { User } from '../../../../user/api/types';
import SakStepFormWrapper from '../../SakStepFormWrapper';
import SakCrawlParameters from './SakCrawlParameters';

interface Props extends SakFormBaseProps {
  advisors: User[];
}

const SakInitStep = ({
  formStepState,
  maalingFormState,
  advisors,
  onSubmit,
}: Props) => {
  const navigate = useNavigate();
  const [displayAdvanced, setDisplayAdvanced] = useState(false);

  const formMethods = useForm<SakFormState>({
    defaultValues: maalingFormState,
    resolver: zodResolver(sakInitValidationSchema),
  });

  const buttonStep: TestlabFormButtonStep = {
    stepType: 'Start',
    onClickBack: () => navigate('/'),
  };

  const toggleAdvancedDisplay = () => {
    setDisplayAdvanced(!displayAdvanced);
  };

  const doSubmit = useCallback((maalingFormState: SakFormState) => {
    if (isNotDefined(formMethods.formState.errors)) {
      onSubmit(maalingFormState);
    } else {
      return;
    }
  }, []);

  return (
    <SakStepFormWrapper
      formStepState={formStepState}
      onSubmit={doSubmit}
      formMethods={formMethods}
      buttonStep={buttonStep}
      hasRequiredFields
    >
      <div className="sak-init">
        <TestlabFormSelect<SakFormState>
          label="Type sak"
          sublabel="Angi type sak du skal opprette"
          name="sakType"
          options={saktypeOptions}
          required
        />
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
          variant={'quiet'}
          iconPlacement={'right'}
          onClick={toggleAdvancedDisplay}
        >
          Avansert
        </Button>
        <SakCrawlParameters displayAdvanced={displayAdvanced} />
      </div>
    </SakStepFormWrapper>
  );
};

export default SakInitStep;
