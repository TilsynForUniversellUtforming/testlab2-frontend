import React from 'react';

import { LoadingTableProps } from '../../types';

const PageSizeSelection = ({ table, loading }: LoadingTableProps) => (
  <form>
    <div>
      <div>
        <label htmlFor="formPageSizeSelection">Elementer per side</label>
      </div>
    </div>
    <div className="w-50">
      <div>
        <select
          id="formPageSizeSelection"
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          // size="sm"
          disabled={loading}
        >
          {[10, 25, 50, 100].map((pageSize) => (
            <option key={`pageSize_${pageSize}`} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  </form>
);

export default PageSizeSelection;
