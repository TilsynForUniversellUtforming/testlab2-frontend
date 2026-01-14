import 'react-loading-skeleton/dist/skeleton.css';

import { Checkbox, Table } from '@digdir/designsystemet-react';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

const TableSkeleton = (props: {columnIsCheckBox:boolean[]}) => (
  <>
    {[...Array(10)].map((_, i) => {
      return (
      <Table.Row key={`skeleton_row_${i}`} className="table-skeleton-row">
        {props.columnIsCheckBox.map((col, i) => {

          return (
            <Table.Cell key={`skeleton_col_${i}`}>
              {col ? (
                <Checkbox
                  data-size="sm"
                  title="laster..."
                  disabled={true}
                  value=""
                  label=""
                />
              ) : (
                <Skeleton />
              )}
            </Table.Cell>
          );
        })}
      </Table.Row>
    );})}
  </>
);

export default TableSkeleton;
