import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';

import { LoadingTableProps } from '../../types';

const PageSizeSelection = ({ table, loading }: LoadingTableProps) => (
  <Form>
    <Row>
      <Col>
        <Form.Label column htmlFor="formPageSizeSelection">
          Elementer per side
        </Form.Label>
      </Col>
    </Row>
    <Row className="w-50">
      <Col>
        <Form.Select
          id="formPageSizeSelection"
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          size="sm"
          disabled={loading}
        >
          {[10, 25, 50, 100].map((pageSize) => (
            <option key={`pageSize_${pageSize}`} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </Form.Select>
      </Col>
    </Row>
  </Form>
);

export default PageSizeSelection;
