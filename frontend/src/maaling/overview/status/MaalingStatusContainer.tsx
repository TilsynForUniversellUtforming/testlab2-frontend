import React from 'react';
import { Button, Col, ListGroup, Row } from 'react-bootstrap';

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
  <ListGroup as="ol" className="w-50">
    <ListGroup.Item as="li">
      <Row>
        <Col className="fw-bold">Status:</Col>
        <Col className="d-flex justify-content-center align-items-center">
          <StatusBadge
            label={maaling.status}
            levels={{
              primary: 'crawling',
              danger: 'feilet',
              success: 'ferdig',
            }}
          />
        </Col>
      </Row>
    </ListGroup.Item>
    <ListGroup.Item>
      <ListGroup variant="flush">
        <ListGroup.Item>
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
        </ListGroup.Item>
        <ListGroup.Item>
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
        </ListGroup.Item>
        <ListGroup.Item>
          <Row>
            <Col md={8}>Publisert</Col>
            <Col md={4}>
              <StatusIcon />
            </Col>
          </Row>
        </ListGroup.Item>
      </ListGroup>
    </ListGroup.Item>
    <ListGroup.Item>
      {maaling.status === 'planlegging' && (
        <Button onClick={() => handleStartCrawling(maaling)}>
          Start sideutvalg
        </Button>
      )}
      {(maaling.status === 'crawling' ||
        maaling.status === 'kvalitetssikring') && (
        <Button onClick={() => handleStartTest(maaling)}>Start test</Button>
      )}
    </ListGroup.Item>
  </ListGroup>
);

export default MaalingStatusContainer;
