import React from 'react';
import { Col, ListGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { appRoutes, getFullPath, idPath } from '../../../common/appRoutes';
import { Maaling } from '../../api/types';

export interface Props {
  id: string;
  maaling: Maaling;
}

const MaalingParametersContainer = ({ id, maaling }: Props) => (
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
          <Link
            to={getFullPath(appRoutes.MAALING, {
              pathParam: idPath,
              id: id,
            })}
          >
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
);

export default MaalingParametersContainer;
