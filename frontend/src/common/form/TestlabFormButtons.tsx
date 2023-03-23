import { Button, ButtonVariant } from '@digdir/design-system-react';
import classNames from 'classnames';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export type StepType = 'Start' | 'Middle' | 'Submit';

export type TestlabFormButtonStep = {
  stepType: StepType;
  onClickBack: () => void;
};

export interface ButtonProps {
  step?: TestlabFormButtonStep;
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
  <div className={classNames('testlab-form__navigation-buttons', className)}>
    <Button type="button" variant={ButtonVariant.Outline} onClick={onClickBack}>
      {textBack}
    </Button>
    <Button type="submit">{textNext}</Button>
  </div>
);

const TestlabFormButtons = ({ step, className }: ButtonProps) => {
  const navigate = useNavigate();

  const defaultStep: TestlabFormButtonStep = {
    stepType: 'Submit',
    onClickBack: () => navigate('..'),
  };

  const buttonStep = step ? step : defaultStep;
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
