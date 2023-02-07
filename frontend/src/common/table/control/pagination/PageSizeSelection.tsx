import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';

import { LoadingTableProps } from '../../types';

const PageSizeSelection = ({ table, loading }: LoadingTableProps) => (
  <Form className="w-50">
    <Row>
      <Form.Label column htmlFor="formPageSizeSelection" className="p-0">
        Elementer per side
      </Form.Label>
      <Col>
        <Form.Select
          id="formPageSizeSelection"
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          size="sm"
          disabled={loading}
          className="w-75"
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
