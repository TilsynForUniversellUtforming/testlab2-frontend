import './loading-bar.scss';

import { Size, TestlabSeverity } from '@common/types';
import { Label } from '@digdir/design-system-react';
import classnames from 'classnames';
import React from 'react';

export interface Props {
  percentage?: number;
  size?: Size;
  customText?: string;
  textPlacement?: 'left' | 'center';
  labelPlacement?: 'top' | 'left' | 'right';
  ariaLabel: string;
  show?: boolean;
  severity?: TestlabSeverity;
  dynamicSeverity?: boolean;
}

const getSeverity = (percentage: number): TestlabSeverity => {
  if (percentage < 60) return 'danger';
  if (percentage < 90) return 'warning';
  return 'success';
};

/**
 * Loading bar component with optional severity coloring.
 * @param {object} props - The props for the component.
 * @param {number} props.percentage - The current percentage value to display (between 0 and 100).
 * @param {string} props.ariaLabel - aria-label for the loading bar.
 * @param {string} props.customText - Optional text
 * @param {boolean} [props.show=true] - If the loading bar should be visible.
 * @param {boolean} [props.dynamicSeverity=true] - If true, color of the loading bar changes based on percentage,
 * between 0 and 100.
 */
const LoadingBar = ({
  percentage,
  size = 'xsmall',
  customText,
  textPlacement = 'center',
  labelPlacement = 'top',
  show = true,
  ariaLabel,
  severity = 'info',
  dynamicSeverity = true,
}: Props) => {
  if (percentage === undefined || !show) return null;

  const color = dynamicSeverity ? getSeverity(percentage) : severity;

  return (
    <div
      className={classnames('loading-bar', size, labelPlacement)}
      title={ariaLabel}
    >
      <Label
        className={classnames('loading-bar__label', textPlacement)}
        size={size}
      >
        {customText ? customText : `${percentage}%`}
      </Label>
      <progress
        className={classnames('loading-bar__progress', color)}
        value={percentage}
        max="100"
        aria-label={ariaLabel}
        aria-valuenow={percentage}
      />
    </div>
  );
};

export default LoadingBar;
