import { TableCell } from '@digdir/design-system-react';
import React from 'react';

import { TableProps } from '../../types';
import PaginationCount from './PaginationCount';
import PaginationSelect from './PaginationSelect';

const PaginationContainer = ({ table }: TableProps) => (
  <>
    <TableCell>
      <PaginationCount table={table} />
    </TableCell>
    <TableCell>
      <PaginationSelect table={table} />
    </TableCell>
  </>
);

export default PaginationContainer;
