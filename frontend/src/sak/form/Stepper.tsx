import { FileTextIcon, Globe2Icon, ListIcon, ToolIcon } from '@digdir/ds-icons';
import classNames from 'classnames';
import React from 'react';

import { SakStep, SakStepType } from '../types';

interface Props {
  currentStep: SakStep;
  steps: SakStep[];
  goToStep: (stepIdx: number) => void;
}

const StepperIcon = ({
  sakStepType,
  active,
}: {
  sakStepType: SakStepType;
  active: boolean;
}) => {
  const color = active ? 'white' : '#68707c';

  switch (sakStepType) {
    case 'Init':
      return <FileTextIcon color={color} />;
    case 'Loeysing':
      return <Globe2Icon color={color} />;
    case 'Testregel':
      return <ToolIcon color={color} />;
    case 'Confirm':
      return <ListIcon color={color} />;
  }
};

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
                  <StepperIcon active={active} sakStepType={step.sakStepType} />
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
