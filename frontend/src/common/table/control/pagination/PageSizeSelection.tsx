import React from 'react';
import { Col, Form } from 'react-bootstrap';

import { LoadingTableProps } from '../../types';

const PageSizeSelection = ({ table, loading }: LoadingTableProps) => (
  <Form>
    <Form.Label htmlFor="formPageSizeSelection">Antall per side</Form.Label>
    <Col sm="1">
      <Form.Select
        id="formPageSizeSelection"
        size="sm"
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
        }}
        disabled={loading}
      >
        {[10, 25, 50, 100].map((pageSize) => (
          <option key={`pageSize_${pageSize}`} value={pageSize}>
            {pageSize}
          </option>
        ))}
      </Form.Select>
    </Col>
  </Form>
);

export default PageSizeSelection;
