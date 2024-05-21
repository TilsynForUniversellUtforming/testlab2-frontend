import { MaalingStep } from '@maaling/types';
import Skeleton from 'react-loading-skeleton';

import StepperIcon from '../stepper/StepperIcon';

export interface Props {
  steps: MaalingStep[];
}

const SakStepFormSkeleton = ({ steps }: Props) => (
  <div className="sak">
    <div className="testlab-form">
      <div className="sak-stepper">
        {steps.map((step) => {
          return (
            <div className="sak-stepper__button" key={step.index}>
              <div className="wrapper">
                <div className="text">{step.stepperTitle}</div>
                <div className="icon">
                  <StepperIcon maalingStepType={step.sakStepType} />
                  {steps.length - 1 > step.index && (
                    <div className="icon__line"></div>
                  )}
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
