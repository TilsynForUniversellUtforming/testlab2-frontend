import './loading-bar.scss';

import React from 'react';

export interface Props {
  percentage?: number;
  tooltip?: string;
  hide?: boolean;
}

const LoadingBar = ({ percentage, tooltip, hide = false }: Props) => {
  if (typeof percentage === 'undefined' || hide) {
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
