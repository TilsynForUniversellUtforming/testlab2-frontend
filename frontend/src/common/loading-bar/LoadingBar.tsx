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
  tooltip?: string;
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
 * @param {string} props.tooltip - Optional tooltip text while hovering.
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
  show = true,
  tooltip,
  severity = 'info',
  dynamicSeverity = true,
}: Props) => {
  if (percentage === undefined || !show) return null;

  const color = dynamicSeverity ? getSeverity(percentage) : severity;
  const style = { width: `${percentage}%` };

  return (
    <div className={classnames('loading-bar', size)} title={tooltip}>
      <Label
        className={classnames('loading-bar__label', textPlacement)}
        size={size}
      >
        {customText ? customText : `${percentage}%`}
      </Label>
      <div className="loading-bar__wrapper">
        <div
          className={classnames('loading-bar__percentage', color)}
          style={style}
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        />
      </div>
    </div>
  );
};

export default LoadingBar;
