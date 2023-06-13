import { Button, List, ListItem } from '@digdir/design-system-react';
import React from 'react';

import { appRoutes, getFullPath, idPath } from '../../../common/appRoutes';
import StatusBadge from '../../../common/status-badge/StatusBadge';
import { Maaling } from '../../api/types';
import useMaalingOverviewStatus from '../../hooks/useMaalingOverviewStatus';
import MaalingStatusRow from './MaalingStatusRow';

export interface Props {
  maaling: Maaling;
  handleStartCrawling: (maaling: Maaling) => void;
  handleStartTest: (maaling: Maaling) => void;
}

const MaalingStatusContainer = ({
  maaling,
  handleStartCrawling,
  handleStartTest,
}: Props) => {
  const maalingOverviewStatus = useMaalingOverviewStatus(maaling);
  const { crawlingStatus, testingStatus } = maalingOverviewStatus;

  return (
    <List>
      <ListItem>
        <div className="status__list-item">
          <div className="bold-text">Status</div>
          <StatusBadge
            status={maaling.status}
            levels={{
              primary: [],
              success: ['testing_ferdig'],
              danger: [],
            }}
          />
        </div>
      </ListItem>
      <ListItem>
        <div className="status-list status__list-item">
          <div className="status__item">
            <MaalingStatusRow
              label={crawlingStatus.label}
              showLink={crawlingStatus.showResult}
              finished={crawlingStatus.finished}
              error={crawlingStatus.failed}
              linkPath={getFullPath(appRoutes.TEST_SIDEUTVAL_LIST, {
                pathParam: idPath,
                id: String(maaling.id),
              })}
            />
          </div>
          <div className="status__item centered">
            <MaalingStatusRow
              label={testingStatus.label}
              showLink={testingStatus.showResult}
              finished={testingStatus.finished}
              error={testingStatus.failed}
              linkPath={getFullPath(appRoutes.TEST_TESTING_LIST, {
                pathParam: idPath,
                id: String(maaling.id),
              })}
            />
          </div>
          <div className="status__item centered">
            <MaalingStatusRow
              label="Publisert"
              showLink={false}
              finished={false}
              error={false}
              linkPath={''}
            />
          </div>
        </div>
      </ListItem>
      {maaling.status !== 'testing' &&
        (crawlingStatus.canStartProcess || testingStatus.canStartProcess) && (
          <ListItem>
            <div className="status__list-item centered">
              {crawlingStatus.canStartProcess && (
                <Button onClick={() => handleStartCrawling(maaling)}>
                  Start sideutval
                </Button>
              )}
              {testingStatus.canStartProcess && (
                <Button onClick={() => handleStartTest(maaling)}>
                  Start test
                </Button>
              )}
              {maaling.status === 'testing_ferdig' && (
                <Button onClick={() => console.log('Publiser')}>
                  Publiser
                </Button>
              )}
            </div>
          </ListItem>
        )}
    </List>
  );
};

export default MaalingStatusContainer;
