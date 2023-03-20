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
    <ul>
      {steps.map((step) => {
        const active = step.index <= currentIdx;

        return (
          <li key={step.stepperTitle}>
            <div>
              {/*sm={7}*/}
              <div>
                <div
                  className={classNames('fs-5', {
                    'text-secondary': !active,
                  })}
                >
                  {step.stepperTitle}
                </div>
                <div
                  className={classNames('d-none d-xl-flex', {
                    'text-secondary': active,
                    'text-muted': !active,
                  })}
                >
                  {step.stepperSubTitle}
                </div>
              </div>
              {/*sm={5}*/}
              <div>
                <div className="d-none d-xl-flex align-items-center justify-content-center">
                  <button
                    onClick={() => goToStep(step.index)}
                    className={classNames('border border-1', {
                      'bg-white': !active,
                      '.bg-light': active,
                    })}
                    style={{
                      width: '5rem',
                      height: '5rem',
                      borderRadius: '50%',
                    }}
                  >
                    <div
                      className={classNames('fs-2', {
                        'text-secondary': active,
                        'text-muted': !active,
                      })}
                    >
                      {step.icon}
                    </div>
                  </button>
                </div>
                <div
                  className="d-none d-xl-flex justify-content-center"
                  style={{ height: '50px' }}
                >
                  <div
                    className={classNames(
                      { 'bg-secondary': active },
                      { 'bg-light': !active }
                    )}
                    style={{ width: '2px' }}
                  ></div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default Stepper;
