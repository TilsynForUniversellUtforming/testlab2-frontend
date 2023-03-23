import { Button, List, ListItem } from '@digdir/design-system-react';
import React from 'react';

import { appRoutes, getFullPath, idPath } from '../../../common/appRoutes';
import StatusBadge from '../../../common/status-badge/StatusBadge';
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
  <List>
    <ListItem>
      <div className="status__list-item">
        <div className="bold-text">Status</div>
        <StatusBadge
          label={maaling.status}
          levels={{
            primary: 'crawling',
            danger: 'feilet',
            success: 'ferdig',
          }}
        />
      </div>
    </ListItem>
    <ListItem>
      <div className="status-list status__list-item">
        <div className="status__item">
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
        </div>
        <div className="status__item">
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
        </div>
        <div className="status__item">
          <MaalingStatusRow label="Publisert" finished={false} linkPath={''} />
        </div>
      </div>
    </ListItem>
    <ListItem>
      <div className="status__list-item">
        {maaling.status === 'planlegging' && (
          <Button onClick={() => handleStartCrawling(maaling)}>
            Start sideutvalg
          </Button>
        )}
        {(maaling.status === 'crawling' ||
          maaling.status === 'kvalitetssikring') && (
          <Button onClick={() => handleStartTest(maaling)}>Start test</Button>
        )}
      </div>
    </ListItem>
  </List>
);

export default MaalingStatusContainer;
