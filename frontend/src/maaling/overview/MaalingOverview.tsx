import React from 'react';
import {
  Button,
  Col,
  Container,
  ListGroup,
  Row,
  Spinner,
} from 'react-bootstrap';
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router-dom';

import { appRoutes, getFullPath } from '../../common/appRoutes';
import ErrorCard from '../../common/error/ErrorCard';
import StatusBadge from '../../common/status-badge/StatusBadge';
import StatusIcon from '../../common/status-badge/StatusIcon';
import { MaalingContext } from '../types';

const MaalingOverview = () => {
  const { loading, error, maaling, handleStartCrawling }: MaalingContext =
    useOutletContext();
  const { id } = useParams();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Spinner
        as="span"
        animation="border"
        size="sm"
        role="status"
        aria-hidden="true"
      />
    );
  }

  if (!maaling || error) {
    return <ErrorCard />;
  }

  return (
    <Container>
      <Row>
        <Col>
          <ListGroup as="ol" className="w-75">
            <ListGroup.Item as="li">
              <Row>
                <Col className="fw-bold">Type:</Col>
                {/*TODO - Ikke implementert for måling ennå */}
                <Col>Kontroll</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item as="li">
              <Row>
                <Col className="fw-bold">Sak:</Col>
                <Col>
                  <Link to={getFullPath(appRoutes.MAALING, id)}>
                    {maaling.navn}
                  </Link>
                </Col>
                {/*TODO - Kommenter ut til når opplegg for sak er laget*/}
                {/*<Col><Link to={getFullPath(appRoutes.SAK, maaling.sakId)}>{maaling.sakNavn}</Link></Col>*/}
              </Row>
            </ListGroup.Item>
            <ListGroup.Item as="li">
              <Row>
                <Col className="fw-bold">Dato start:</Col>
                <Col>{new Date().toISOString()}</Col>
                {/*TODO - Kommenter ut til når måling har dato*/}
                {/*<Col>{maaling.dateStart}</Col>*/}
              </Row>
            </ListGroup.Item>
            <ListGroup.Item as="li">
              <Row>
                <Col className="fw-bold">Dato avslutta:</Col>
                <Col>Pågår</Col>
                {/*TODO - Kommenter ut til når måling har dato*/}
                {/*<Col>{maaling.dateEnd}</Col>*/}
              </Row>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col>
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
                  <Row>
                    <Col md={8}>
                      Sideutvalg ({maaling.numCrawlFinished}/
                      {maaling.loeysingList.length})
                    </Col>
                    <Col md={4}>
                      <StatusIcon
                        finished={
                          maaling.numCrawlFinished ===
                          maaling.loeysingList.length
                        }
                      />
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col md={8}>
                      Testing ({maaling.testResultat?.length ?? 0}/
                      {maaling.loeysingList.length})
                    </Col>
                    <Col md={4}>
                      <StatusIcon />
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col md={8}>Publisert</Col>
                    {/*TODO - Ikke implementert for måling ennå */}
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
                <Button
                  onClick={() =>
                    navigate(
                      getFullPath(
                        appRoutes.TEST_SIDEUTVAL_LIST,
                        String(maaling.id)
                      )
                    )
                  }
                >
                  Se sideutvalg
                </Button>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default MaalingOverview;
