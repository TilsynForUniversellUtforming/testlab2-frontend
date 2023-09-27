import { SakStep } from '@sak/types';
import Skeleton from 'react-loading-skeleton';

import StepperIcon from '../StepperIcon';

export interface Props {
  steps: SakStep[];
}

const SakStepFormSkeleton = ({ steps }: Props) => (
  <div className="sak">
    <div className="testlab-form">
      <div className="sak-stepper">
        {steps.map((step) => {
          return (
            <div className="sak-stepper__button" key={step.index}>
              <div className="wrapper">
                <div className="text">
                  <div className="title">{step.stepperTitle}</div>
                  {step.stepperSubTitle}
                </div>
                <div className="icon">
                  <StepperIcon sakStepType={step.sakStepType} />
                  <div className="icon__line"></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="sak__form">
        <header className="testlab-form__header">
          <h2 className="heading">Laster...</h2>
        </header>
        <div className="sak__container">
          <div className="sak-init">
            <div className="testlab-form__select">
              <Skeleton height={35} width={350} />
            </div>
            <div className="testlab-form__select">
              <Skeleton height={35} width={350} />
            </div>
            <div className="testlab-form__select">
              <Skeleton height={35} width={350} />
            </div>
            <div className="testlab-form__select">
              <Skeleton height={35} width={350} />
            </div>
          </div>
        </div>
        <div className="testlab-form__navigation-buttons">
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '1rem 0',
              gap: '1rem',
            }}
          >
            <Skeleton height={35} width={85} />
            <Skeleton height={35} width={85} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SakStepFormSkeleton;
