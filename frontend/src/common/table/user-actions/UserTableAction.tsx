import { Button } from '@digdir/design-system-react';
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
      <Button
        onClick={() => {
          startAllAction(table);
        }}
      >
        &#9658;
      </Button>
    )}
  </div>
);

export default UserTableActions;
