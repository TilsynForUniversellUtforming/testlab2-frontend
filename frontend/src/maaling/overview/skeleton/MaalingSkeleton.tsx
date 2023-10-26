import React from 'react';
import Skeleton from 'react-loading-skeleton';

import MaalingStatusContainerSkeleton from './MaalingStatusContainerSkeleton';

const MaalingSkeleton = () => {
  return (
    <div className="maaling-overview">
      <div className="parameter">
        <ul className="testlab-list">
          <li className="testlab-list__item">
            <div className="parameter__item">
              <div className="bold-text">Type</div>
              <Skeleton width={125} />
            </div>
          </li>
          <li className="testlab-list__item">
            <div className="parameter__item">
              <div className="bold-text">Sak</div>
              <Skeleton width={125} />
            </div>
          </li>
          <li className="testlab-list__item">
            <div className="parameter__item">
              <div className="bold-text">Dato start</div>
              <Skeleton width={125} />
            </div>
          </li>
          <li className="testlab-list__item">
            <div className="parameter__item">
              <div className="bold-text">Dato avslutta</div>
              <Skeleton width={125} />
            </div>
          </li>
        </ul>
      </div>
      <div className="status">
        <MaalingStatusContainerSkeleton />
      </div>
    </div>
  );
};

export default MaalingSkeleton;
