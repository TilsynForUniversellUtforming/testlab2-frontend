import React from 'react';
import { Col, Container, ListGroup, Row } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';

const MaalingSkeleton = () => {
  return (
    <Container>
      <Row>
        <Col>
          <ListGroup as="ol" className="w-75">
            <ListGroup.Item as="li">
              <Row>
                <Col className="fw-bold">Type:</Col>
                <Col>
                  <Skeleton />
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item as="li">
              <Row>
                <Col className="fw-bold">Sak:</Col>
                <Col>
                  <Skeleton />
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item as="li">
              <Row>
                <Col className="fw-bold">Dato start:</Col>
                <Col>
                  <Skeleton />
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item as="li">
              <Row>
                <Col className="fw-bold">Dato avslutta:</Col>
                <Col>
                  <Skeleton />
                </Col>
              </Row>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col>
          <ListGroup as="ol" className="w-50">
            <ListGroup.Item as="li">
              <Row>
                <Col className="fw-bold">Status:</Col>
                <Skeleton width={70} />
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col md={8}>
                      <div>Sideutvalg</div>
                      <div>
                        <Skeleton />
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col md={8}>
                      <div>Testing</div>
                      <div>
                        <Skeleton />
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col md={8}>
                      <div>Publisert</div>
                      <div>
                        <Skeleton />
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </ListGroup.Item>
            <ListGroup.Item>
              <Skeleton height={50} />
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default MaalingSkeleton;
