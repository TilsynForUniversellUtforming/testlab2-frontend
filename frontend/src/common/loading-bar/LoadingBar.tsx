import './loading-bar.scss';

import { Severity } from '@common/types';
import { Label } from '@digdir/design-system-react';
import classnames from 'classnames';
import React from 'react';

export interface Props {
  percentage?: number;
  tooltip?: string;
  show?: boolean;
  dynamicSeverity?: boolean;
}

const getSeverity = (percentage: number): Severity => {
  if (percentage < 60) return 'danger';
  if (percentage < 90) return 'warning';
  return 'success';
};

/**
 * Loading bar component with optional severity coloring.
 * @param {object} props - The props for the component.
 * @param {number} props.percentage - The current percentage value to display (between 0 and 100).
 * @param {string} props.tooltip - Optional tooltip text while hovering.
 * @param {boolean} [props.show=true] - If the loading bar should be visible.
 * @param {boolean} [props.dynamicSeverity=true] - If true, color of the loading bar changes based on percentage,
 * between 0 and 100.
 */
const LoadingBar = ({
  percentage,
  tooltip,
  show = true,
  dynamicSeverity = true,
}: Props) => {
  if (percentage === undefined || !show) return null;

  const color = dynamicSeverity ? getSeverity(percentage) : 'info';
  const style = { width: `${percentage}%` };

  return (
    <div className="loading-bar" title={tooltip}>
      <Label className="loading-bar__label" size="xsmall">
        {percentage}%
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
