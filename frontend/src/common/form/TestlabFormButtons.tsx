import classNames from 'classnames';
import React from 'react';
import { Button } from 'react-bootstrap';

import useDefaultSubmitStep from './hooks/useSteps';

export type StepType = 'Start' | 'Middle' | 'Submit';

export type Step = {
  stepType: StepType;
  onClickBack: () => void;
};

export interface ButtonProps {
  step?: Step;
  className?: string;
}

const FormButton = ({
  textBack,
  textNext,
  onClickBack,
  className,
}: {
  textBack: string;
  textNext: string;
  onClickBack: () => void;
  className?: string;
}) => (
  <div className={classNames('mb-3', className)}>
    <Button variant="secondary" className="me-3" onClick={onClickBack}>
      {textBack}
    </Button>
    <Button type="submit">{textNext}</Button>
  </div>
);

const TestlabFormButtons = ({ step, className }: ButtonProps) => {
  const buttonStep = step ? step : useDefaultSubmitStep();
  const { stepType, onClickBack } = buttonStep;

  switch (stepType) {
    case 'Start':
      return (
        <FormButton
          textBack="Avbryt"
          textNext="Neste"
          onClickBack={onClickBack}
          className={className}
        />
      );
    case 'Middle':
      return (
        <FormButton
          textBack="Tilbake"
          textNext="Neste"
          onClickBack={onClickBack}
          className={className}
        />
      );
    case 'Submit':
      return (
        <FormButton
          textBack="Tilbake"
          textNext="Lagre"
          onClickBack={onClickBack}
          className={className}
        />
      );
    default:
      throw new Error('Ulovlig tilstand');
  }
};

export default TestlabFormButtons;
