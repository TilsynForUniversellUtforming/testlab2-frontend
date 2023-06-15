import { List, ListItem } from '@digdir/design-system-react';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import MaalingStatusContainerSkeleton from './MaalingStatusContainerSkeleton';

const MaalingSkeleton = () => {
  return (
    <div className="maaling-overview">
      <div className="parameter">
        <List>
          <ListItem>
            <div className="parameter__item">
              <div className="bold-text">Type</div>
              <Skeleton width={125} />
            </div>
          </ListItem>
          <ListItem>
            <div className="parameter__item">
              <div className="bold-text">Sak</div>
              <Skeleton width={125} />
            </div>
          </ListItem>
          <ListItem>
            <div className="parameter__item">
              <div className="bold-text">Dato start</div>
              <Skeleton width={125} />
            </div>
          </ListItem>
          <ListItem>
            <div className="parameter__item">
              <div className="bold-text">Dato avslutta</div>
              <Skeleton width={125} />
            </div>
          </ListItem>
        </List>
      </div>
      <div className="status">
        <MaalingStatusContainerSkeleton />
      </div>
    </div>
  );
};

export default MaalingSkeleton;
