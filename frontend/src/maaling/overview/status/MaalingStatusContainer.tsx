import AlertTimed from '@common/alert/AlertTimed';
import TestlabLoadingButton from '@common/button/TestlabLoadingButton';
import TestlabStatusTag from '@common/status-badge/TestlabStatusTag';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { Spinner } from '@digdir/design-system-react';
import { TEST_SIDEUTVAL_LIST, TEST_TESTING_LIST } from '@maaling/MaalingRoutes';
import React from 'react';

import { Maaling, MaalingStatus } from '../../api/types';
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

  const pollingStatuses: MaalingStatus[] = ['crawling', 'testing'];

  return (
    <div className="status">
      <ul className="testlab-list">
        <li className="testlab-list__item">
          <div className="status__list-item">
            <div className="bold-text">Status</div>
            <div className="status__list-item-icon">
              <TestlabStatusTag<MaalingStatus>
                status={maaling.status}
                colorMapping={{
                  third: pollingStatuses,
                  success: ['testing_ferdig'],
                }}
              />
              {pollingStatuses.includes(maaling.status) && (
                <Spinner title="Oppdaterer måling" size="small" />
              )}
            </div>
          </div>
        </li>
        <li className="testlab-list__item">
          <div className="status-list status__list-item">
            <div className="status__item">
              <MaalingStatusRow
                label={crawlingStatus.label}
                showLink={crawlingStatus.showResult}
                finished={crawlingStatus.finished}
                error={crawlingStatus.failed}
                linkPath={getFullPath(TEST_SIDEUTVAL_LIST, {
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
                linkPath={getFullPath(TEST_TESTING_LIST, {
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
                linkPath={getFullPath(TEST_TESTING_LIST, {
                  pathParam: idPath,
                  id: String(maaling.id),
                })}
              />
            </div>
          </div>
        </li>
        {maaling.status !== 'testing' &&
          (crawlingStatus.canStartProcess ||
            testingStatus.canStartProcess ||
            publishStatus.canStartProcess) && (
            <li className="testlab-list__item">
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
            </li>
          )}
      </ul>
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
