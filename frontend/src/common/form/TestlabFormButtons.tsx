import { ButtonVariant } from '@common/types';
import { Button } from '@digdir/design-system-react';
import classNames from 'classnames';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export type StepType = 'Start' | 'Middle' | 'Submit' | 'Custom';

export type TestlabFormButtonStep = {
  stepType: StepType;
  customBackText?: string;
  customNextText?: string;
  onClickBack: () => void;
};

export interface ButtonProps {
  step?: TestlabFormButtonStep;
  className?: string;
  loading?: boolean;
}

export interface FormButtonProps {
  textBack: string;
  textNext: string;
  onClickBack: () => void;
  className?: string;
  loading?: boolean;
}

const FormButton = ({
  textBack,
  textNext,
  onClickBack,
  className,
  loading,
}: FormButtonProps) => (
  <div className={classNames('testlab-form__navigation-buttons', className)}>
    <Button type="button" variant={ButtonVariant.Outline} onClick={onClickBack}>
      {textBack}
    </Button>
    <Button type={loading ? 'button' : 'submit'} aria-disabled={loading}>
      {textNext}
    </Button>
  </div>
);

const TestlabFormButtons = ({ step, className, loading }: ButtonProps) => {
  const navigate = useNavigate();
  const defaultStep: TestlabFormButtonStep = {
    stepType: 'Submit',
    onClickBack: () => navigate('..'),
  };
  const buttonStep = step || defaultStep;

  const buttonTexts: Record<StepType, { back: string; next: string }> = {
    Start: { back: 'Avbryt', next: 'Neste' },
    Middle: { back: 'Tilbake', next: 'Neste' },
    Submit: { back: 'Tilbake', next: 'Lagre' },
    Custom: {
      back: step?.customBackText || 'Tilbake',
      next: step?.customNextText || 'Lagre',
    },
  };

  if (!buttonTexts[buttonStep.stepType]) {
    throw new Error(`Ugylding type ${buttonStep.stepType}`);
  }

  return (
    <FormButton
      textBack={buttonTexts[buttonStep.stepType].back}
      textNext={buttonTexts[buttonStep.stepType].next}
      onClickBack={buttonStep.onClickBack}
      className={className}
      loading={loading}
    />
  );
};

export default TestlabFormButtons;
