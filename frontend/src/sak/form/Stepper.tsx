import './sak-stepper.scss';

import { semanticSurfaceActionDefault } from '@digdir/design-system-tokens';
import {
  EarthIcon,
  FileTextIcon,
  TasklistIcon,
  WrenchIcon,
} from '@navikt/aksel-icons';
import classNames from 'classnames';
import React from 'react';

import { FormStepState } from '../hooks/useSakForm';
import { SakStepType } from '../types';

interface Props {
  formStepState: FormStepState;
}

const StepperIcon = ({ sakStepType }: { sakStepType: SakStepType }) => {
  switch (sakStepType) {
    case 'Init':
      return (
        <FileTextIcon color={semanticSurfaceActionDefault} fontSize="2rem" />
      );
    case 'Loeysing':
      return <EarthIcon color={semanticSurfaceActionDefault} fontSize="2rem" />;
    case 'Testregel':
      return (
        <WrenchIcon color={semanticSurfaceActionDefault} fontSize="2rem" />
      );
    case 'Confirm':
      return (
        <TasklistIcon color={semanticSurfaceActionDefault} fontSize="2rem" />
      );
  }
};

const Stepper = ({ formStepState }: Props) => {
  const { steps, nextStepIdx, goToStep } = formStepState;

  return (
    <div className="sak-stepper" aria-hidden="true">
      {steps.map((step) => {
        const active = step.index < nextStepIdx;

        return (
          <button
            onClick={() => goToStep(step.index)}
            type="button"
            className={classNames('sak-stepper__button', { active: active })}
            key={step.index}
            disabled={!active}
          >
            <div className="wrapper">
              <div className={classNames('text', { active: active })}>
                <div className="title">{step.stepperTitle}</div>
                {step.stepperSubTitle}
              </div>
              <div className={classNames('icon', { active: active })}>
                <StepperIcon sakStepType={step.sakStepType} />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default Stepper;
