import React from 'react';
import Skeleton from 'react-loading-skeleton';

const StatusIconSkeleton = () => (
  <div className="status-icon-wrapper">
    <Skeleton width={32} height={32} circle={true} />
  </div>
);

const MaalingStatusContainerSkeleton = () => (
  <ul className="testlab-list">
    <li className="testlab-list__item">
      <div className="status__list-item">
        <div className="bold-text">Status</div>
        <Skeleton width={85} />
      </div>
    </li>
    <li className="testlab-list__item">
      <div className="status-list status__list-item">
        <div className="status__item">
          <div className="link-text">
            <div className="status-icon-wrapper">Sideutval</div>
          </div>
          <StatusIconSkeleton />
        </div>
        <div className="status__item">
          <div className="link-text">
            <div className="status-icon-wrapper">Testing</div>
          </div>
          <StatusIconSkeleton />
        </div>
        <div className="status__item">
          <div className="link-text">
            <div className="status-icon-wrapper">Publisert</div>
          </div>
          <StatusIconSkeleton />
        </div>
      </div>
    </li>
    <li className="testlab-list__item">
      <div
        style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0' }}
      >
        <Skeleton height={35} width={145} />
      </div>
    </li>
  </ul>
);

export default MaalingStatusContainerSkeleton;
