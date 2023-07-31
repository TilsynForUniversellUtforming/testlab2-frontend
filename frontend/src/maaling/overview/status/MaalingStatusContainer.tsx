import AlertTimed from '@common/alert/AlertTimed';
import { appRoutes, getFullPath, idPath } from '@common/appRoutes';
import TestlabLoadingButton from '@common/button/TestlabLoadingButton';
import StatusBadge from '@common/status-badge/StatusBadge';
import { List, ListItem, Spinner } from '@digdir/design-system-react';
import React from 'react';

import { Maaling } from '../../api/types';
import useMaalingOverviewStatus from '../../hooks/useMaalingOverviewStatus';
import { MaalingTestStatus } from '../../types';
import MaalingStatusRow from './MaalingStatusRow';

export interface Props {
  maaling: Maaling;
  handleStartCrawling: (maaling: Maaling) => void;
  handleStartTest: (maaling: Maaling) => void;
  handleStartPublish: (maaling: Maaling) => void;
  testStatus: MaalingTestStatus;
  clearTestStatus: () => void;
}

const MaalingStatusContainer = ({
  maaling,
  handleStartCrawling,
  handleStartTest,
  handleStartPublish,
  testStatus,
  clearTestStatus,
}: Props) => {
  const maalingOverviewStatus = useMaalingOverviewStatus(maaling);
  const { crawlingStatus, testingStatus, publishStatus } =
    maalingOverviewStatus;

  const pollingStatuses = ['crawling', 'testing'];

  return (
    <div className="status">
      <List>
        <ListItem>
          <div className="status__list-item">
            <div className="bold-text">Status</div>
            <div className="status__list-item-icon">
              <StatusBadge
                status={maaling.status}
                levels={{
                  primary: pollingStatuses,
                  success: ['testing_ferdig'],
                  danger: [],
                }}
              />
              {pollingStatuses.includes(maaling.status) && (
                <Spinner title="Oppdaterer måling" variant="inverted" />
              )}
            </div>
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
            <div className="status__item">
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
            <div className="status__item">
              <MaalingStatusRow
                label={publishStatus.label}
                showLink={publishStatus.showResult}
                finished={publishStatus.finished}
                error={publishStatus.failed}
                linkPath={getFullPath(appRoutes.TEST_TESTING_LIST, {
                  pathParam: idPath,
                  id: String(maaling.id),
                })}
              />
            </div>
          </div>
        </ListItem>
        {maaling.status !== 'testing' &&
          (crawlingStatus.canStartProcess ||
            testingStatus.canStartProcess ||
            publishStatus.canStartProcess) && (
            <ListItem>
              <div className="status__list-item centered">
                {crawlingStatus.canStartProcess && (
                  <TestlabLoadingButton
                    title="Start sideutval"
                    onClick={() => handleStartCrawling(maaling)}
                    loading={testStatus.loading}
                    loadingText="Starter crawling"
                  />
                )}
                {testingStatus.canStartProcess && (
                  <TestlabLoadingButton
                    title="Start test"
                    onClick={() => handleStartTest(maaling)}
                    loading={testStatus.loading}
                    loadingText="Starter testing"
                  />
                )}
                {maaling.status === 'testing_ferdig' && (
                  <TestlabLoadingButton
                    title="Publiser"
                    onClick={() => handleStartPublish(maaling)}
                    loading={testStatus.loading}
                    loadingText="Starter publisering"
                  />
                )}
              </div>
            </ListItem>
          )}
      </List>
      {testStatus.message && (
        <div className="status__alert">
          <AlertTimed
            severity={testStatus?.severity}
            message={testStatus.message}
            clearMessage={clearTestStatus}
          />
        </div>
      )}
    </div>
  );
};

export default MaalingStatusContainer;
