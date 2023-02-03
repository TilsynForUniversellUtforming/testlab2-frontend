import React from 'react';
import { Form } from 'react-bootstrap';

import { LoadingTableProps } from '../../types';

const PageSizeSelection = ({ table, loading }: LoadingTableProps) => (
  <Form>
    <Form.Label htmlFor="formPageSizeSelection">Antall per side</Form.Label>
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
  </Form>
);

export default PageSizeSelection;
