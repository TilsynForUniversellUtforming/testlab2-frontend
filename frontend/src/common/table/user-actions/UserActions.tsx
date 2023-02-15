import { Row } from '@tanstack/react-table';
import React from 'react';
import { Button } from 'react-bootstrap';

export interface ColumnUserAction {
  deleteAction?: (row: Row<any>) => void;
  editAction?: (row: Row<any>) => void;
  statisticsAction?: (row: Row<any>) => void;
}

export interface ColumnUserActionSelection extends ColumnUserAction {
  row: Row<any>;
}

const UserActions = ({
  deleteAction = undefined,
  editAction = undefined,
  statisticsAction = undefined,
  row,
}: ColumnUserActionSelection) => (
  <div className="digdir-table__user-action">
    {deleteAction && (
      <Button
        size="sm"
        variant="danger"
        onClick={() => {
          deleteAction(row);
        }}
      >
        &#10005;
      </Button>
    )}
    {editAction && (
      <Button size="sm" variant="info">
        &#9998;
      </Button>
    )}
    {statisticsAction && (
      <Button size="sm" variant="secondary">
        &#x2211;
      </Button>
    )}
  </div>
);

export default UserActions;
