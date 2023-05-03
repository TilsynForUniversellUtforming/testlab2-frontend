import './sak-stepper.scss';

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
      return <FileTextIcon color={color} fontSize="2rem" />;
    case 'Loeysing':
      return <EarthIcon color={color} fontSize="2rem" />;
    case 'Testregel':
      return <WrenchIcon color={color} fontSize="2rem" />;
    case 'Confirm':
      return <TasklistIcon color={color} fontSize="2rem" />;
  }
};

const Stepper = ({ formStepState }: Props) => {
  const { steps, currentStepIdx, goToStep } = formStepState;
  const currentIdx = currentStepIdx;

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
