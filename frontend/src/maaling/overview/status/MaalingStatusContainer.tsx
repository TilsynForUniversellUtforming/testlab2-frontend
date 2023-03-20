import React from 'react';

import { appRoutes, getFullPath, idPath } from '../../../common/appRoutes';
import StatusBadge from '../../../common/status-badge/StatusBadge';
import StatusIcon from '../../../common/status-badge/StatusIcon';
import { Maaling } from '../../api/types';
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
}: Props) => (
  <ol className="w-50">
    <li>
      <div>
        <div className="fw-bold">Status:</div>
        <div className="d-flex justify-content-center align-items-center">
          <StatusBadge
            label={maaling.status}
            levels={{
              primary: 'crawling',
              danger: 'feilet',
              success: 'ferdig',
            }}
          />
        </div>
      </div>
    </li>
    <li>
      <ul>
        <li>
          <MaalingStatusRow
            label={`Sideutvalg (${maaling.crawlStatistics.numFinished}/${maaling.loeysingList.length})`}
            finished={
              maaling.crawlStatistics.numFinished ===
              maaling.loeysingList.length
            }
            linkPath={getFullPath(appRoutes.TEST_SIDEUTVAL_LIST, {
              pathParam: idPath,
              id: String(maaling.id),
            })}
          />
        </li>
        <li>
          <MaalingStatusRow
            label={`Testing (${maaling.testStatistics.numFinished}/${maaling.loeysingList.length})`}
            finished={
              maaling.testStatistics.numFinished === maaling.loeysingList.length
            }
            linkPath={getFullPath(appRoutes.TEST_SIDEUTVAL_LIST, {
              pathParam: idPath,
              id: String(maaling.id),
            })}
          />
        </li>
        <li>
          <div>
            {/*md={8}*/}
            <div>Publisert</div>
            {/*md={4}*/}
            <div>
              <StatusIcon />
            </div>
          </div>
        </li>
      </ul>
    </li>
    <li>
      {maaling.status === 'planlegging' && (
        <button onClick={() => handleStartCrawling(maaling)}>
          Start sideutvalg
        </button>
      )}
      {(maaling.status === 'crawling' ||
        maaling.status === 'kvalitetssikring') && (
        <button onClick={() => handleStartTest(maaling)}>Start test</button>
      )}
    </li>
  </ol>
);

export default MaalingStatusContainer;
