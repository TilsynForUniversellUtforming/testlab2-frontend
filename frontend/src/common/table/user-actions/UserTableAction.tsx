import { Table } from '@tanstack/react-table';
import React from 'react';

export interface HeaderUserAction {
  startAllAction?: (table: Table<any>) => void;
}

export interface HeaderUserActionSelection extends HeaderUserAction {
  table: Table<any>;
}

const UserTableActions = ({
  startAllAction = undefined,
  table,
}: HeaderUserActionSelection) => (
  <div className="testlab-table__user-action">
    {startAllAction && (
      <button
        // size="sm"
        // variant="success"
        onClick={() => {
          startAllAction(table);
        }}
      >
        &#9658;
      </button>
    )}
  </div>
);

export default UserTableActions;
