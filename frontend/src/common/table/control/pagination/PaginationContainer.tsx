import React from 'react';

import { TableProps } from '../../types';
import PaginationCount from './PaginationCount';
import PaginationSelect from './PaginationSelect';

const PaginationContainer = ({ table }: TableProps) => (
  <div>
    <div>
      <div>
        <PaginationCount table={table} />
      </div>
      <div className="d-flex flex-row-reverse">
        <PaginationSelect table={table} />
      </div>
    </div>
  </div>
);

export default PaginationContainer;
