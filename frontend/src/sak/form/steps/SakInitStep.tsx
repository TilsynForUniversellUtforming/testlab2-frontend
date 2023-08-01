import { TestlabFormButtonStep } from '@common/form/TestlabFormButtons';
import TestlabFormInput from '@common/form/TestlabFormInput';
import TestlabFormSelect from '@common/form/TestlabFormSelect';
import { isNotDefined } from '@common/util/util';
import { Button, Paragraph } from '@digdir/design-system-react';
import { CogIcon } from '@navikt/aksel-icons';
import {
  SakContext,
  SakFormBaseProps,
  SakFormState,
  saktypeOptions,
} from '@sak/types';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useOutletContext } from 'react-router-dom';

import SakStepFormWrapper from '../SakStepFormWrapper';
import SakCrawlParameters from './loeysing/SakCrawlParameters';

const SakInitStep = ({
  formStepState,
  maalingFormState,
  onSubmit,
}: SakFormBaseProps) => {
  const { advisors }: SakContext = useOutletContext();

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
    >
      <div className="sak-init">
        <Paragraph spacing size="xsmall">
          Felter markert med * er obligatoriske
        </Paragraph>
        <TestlabFormSelect<SakFormState>
          label="Type sak*"
          sublabel="Angi type sak du skal opprette"
          name="sakType"
          options={saktypeOptions}
          formValidation={{
            errorMessage: 'Type sak må vejast',
            validation: { required: true },
          }}
        />
        <TestlabFormInput<SakFormState>
          label="Tittel*"
          sublabel="Angi sakstype og årstall. Ta med namn på verksemd
når saka berre gjeld éi løysing/verksemd. Eksempel: Tilsyn 2023 Andeby."
          name="navn"
          formValidation={{
            errorMessage: 'Tittel kan ikkje væra tom',
            validation: { required: true, minLength: 1 },
          }}
        />
        <TestlabFormSelect<SakFormState>
          label="Sakshandsamar*"
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
        {displayAdvanced && (
          <SakCrawlParameters
            watch={formMethods.watch}
            setError={formMethods.setError}
            clearErrors={formMethods.clearErrors}
            errors={formMethods.formState.errors}
          />
        )}
      </div>
    </SakStepFormWrapper>
  );
};

export default SakInitStep;
