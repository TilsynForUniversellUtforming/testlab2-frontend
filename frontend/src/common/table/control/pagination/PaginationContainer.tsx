import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { TableProps } from '../../types';
import PaginationCount from './PaginationCount';
import PaginationSelect from './PaginationSelect';

const PaginationContainer = ({ table }: TableProps) => (
  <Container>
    <Row>
      <Col>
        <PaginationCount table={table} />
      </Col>
      <Col className="d-flex flex-row-reverse">
        <PaginationSelect table={table} />
      </Col>
    </Row>
  </Container>
);

export default PaginationContainer;
