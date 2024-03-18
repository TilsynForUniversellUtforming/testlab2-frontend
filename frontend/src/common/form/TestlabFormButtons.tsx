import { ButtonColor, ButtonColorType, ButtonVariant } from '@common/types';
import { Button } from '@digdir/designsystemet-react';
import classNames from 'classnames';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export type TestlabButtonStepType = 'Start' | 'Middle' | 'Submit' | 'Custom';

export type TestlabFormButtonStep = {
  stepType: TestlabButtonStepType;
  customBackText?: string;
  customNextText?: string;
  customColor?: ButtonColorType;
  onClickBack: () => void;
};

export interface TestlabFormButtonProps {
  step?: TestlabFormButtonStep;
  className?: string;
  loading?: boolean;
  textBack?: string;
  textNext?: string;
  onClickBack?: () => void;
}

/**
 * A pair of buttons for navigating through form steps or for custom actions, styled according to the Testlab design system.
 *
 * @param {TestlabFormButtonProps} props - The props for the component.
 * @param {TestlabFormButtonStep} [props.step] - The current step information of the form, including type, custom texts, and actions.
 * @param {string} [props.className] - Optional additional class names for custom styling.
 * @param {boolean} [props.loading] - Indicates if the form is in a loading state.
 *
 * @returns {ReactNode}
 */
const TestlabFormButtons = ({
  step,
  className,
  loading,
}: TestlabFormButtonProps): ReactNode => {
  const navigate = useNavigate();

  const defaultStep: TestlabFormButtonStep = {
    stepType: 'Submit',
    onClickBack: () => navigate('..'),
  };

  const buttonStep = step || defaultStep;
  const { stepType, onClickBack, customBackText, customNextText, customColor } =
    buttonStep;

  const buttonTexts: Record<
    TestlabButtonStepType,
    { back: string; next: string; color: ButtonColorType }
  > = {
    Start: { back: 'Avbryt', next: 'Neste', color: ButtonColor.Primary },
    Middle: { back: 'Tilbake', next: 'Neste', color: ButtonColor.Primary },
    Submit: { back: 'Tilbake', next: 'Lagre', color: ButtonColor.Success },
    Custom: {
      back: customBackText || 'Tilbake',
      next: customNextText || 'Lagre',
      color: customColor || ButtonColor.Primary,
    },
  };

  const { back, next, color } = buttonTexts[stepType];

  return (
    <div className={classNames('testlab-form__navigation-buttons', className)}>
      <Button
        type="button"
        variant={ButtonVariant.Outline}
        onClick={onClickBack}
      >
        {back}
      </Button>
      <Button
        type={loading ? 'button' : 'submit'}
        aria-disabled={loading}
        color={color}
      >
        {next}
      </Button>
    </div>
  );
};

export default TestlabFormButtons;
