import './sak-stepper.scss';

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
  const color = active ? 'white' : '#0062ba';

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
          <button
            onClick={() => goToStep(step.index)}
            type="submit"
            className="sak-stepper__button"
            key={step.index}
            name="navn"
          >
            <div className="wrapper">
              <div className="text">
                <div className={classNames('title', { active: active })}>
                  {step.stepperTitle}
                </div>
                <div className={classNames({ active: active })}>
                  {step.stepperSubTitle}
                </div>
              </div>
              <div className={classNames('icon', { active: active })}>
                <StepperIcon active={active} sakStepType={step.sakStepType} />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default Stepper;
