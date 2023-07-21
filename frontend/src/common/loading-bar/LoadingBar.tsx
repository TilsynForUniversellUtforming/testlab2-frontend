import './loading-bar.scss';

import React from 'react';

export interface Props {
  percentage?: number;
  tooltip?: string;
}

const LoadingBar = ({ percentage, tooltip }: Props) => {
  if (typeof percentage === 'undefined') {
    return null;
  }

  return (
    <div className="loading-bar-container" title={tooltip}>
      <div className="loading-bar" style={{ width: `${percentage}%` }}>
        {percentage > 10 && (
          <div className="percentage-label">{percentage}%</div>
        )}
      </div>
    </div>
  );
};

export default LoadingBar;
