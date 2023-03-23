import classNames from 'classnames';
import React from 'react';

import { SakStep } from '../types';

interface Props {
  currentStep: SakStep;
  steps: SakStep[];
  goToStep: (stepIdx: number) => void;
}

const Stepper = ({ steps, currentStep, goToStep }: Props) => {
  const currentIdx = currentStep.index;

  return (
    <div className="sak-stepper" aria-hidden="true">
      {steps.map((step) => {
        const active = step.index <= currentIdx;

        return (
          <div
            className="sak-stepper__container"
            key={step.index}
            style={{ gridRow: `${step.index + 1}` }}
          >
            <div className="sak-stepper__text">
              <div>
                <div className={classNames('title', { active: active })}>
                  {step.stepperTitle}
                </div>
                <div className={classNames({ active: active })}>
                  {step.stepperSubTitle}
                </div>
              </div>
            </div>
            <div className="sak-stepper__icon">
              <div className="icon-wrapper">
                <button
                  onClick={() => goToStep(step.index)}
                  className={classNames('icon-button', {
                    active: active,
                  })}
                  style={{
                    width: '5rem',
                    height: '5rem',
                    borderRadius: '50%',
                  }}
                >
                  {step.icon}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
