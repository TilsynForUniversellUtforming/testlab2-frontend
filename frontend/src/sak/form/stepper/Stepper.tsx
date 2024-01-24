import './sak-stepper.scss';

import { FormStepState } from '@sak/hooks/useSakForm';
import classNames from 'classnames';
import React from 'react';

import StepperIcon from './StepperIcon';

interface Props {
  formStepState: FormStepState;
}

const Stepper = ({ formStepState }: Props) => {
  const { steps, currentStep, nextStepIdx, goToStep } = formStepState;

  return (
    <div className="sak-stepper">
      {steps.map((step) => {
        const active = step.index < nextStepIdx;
        const isCurrentStep = currentStep.index === step.index;

        return (
          <button
            onClick={() => goToStep(step.index)}
            type="button"
            className={classNames('sak-stepper__button', {
              active: active,
              current: isCurrentStep,
            })}
            key={step.index}
            disabled={!active}
          >
            <div className="wrapper">
              <div className={classNames('icon', { active: active })}>
                <StepperIcon sakStepType={step.sakStepType} />
                {steps.length - 1 > step.index && (
                  <div className="icon__line"></div>
                )}
              </div>
              <div className={classNames('text', { active: active })}>
                {step.stepperTitle}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default Stepper;
