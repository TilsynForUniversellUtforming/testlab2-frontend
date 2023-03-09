import { Row } from '@tanstack/react-table';
import React from 'react';
import { Button } from 'react-bootstrap';

export interface ColumnUserAction {
  deleteAction?: (row: Row<any>) => void;
  deleteTooltip?: string;
  editAction?: (row: Row<any>) => void;
  editTooltip?: string;
  statisticsAction?: (row: Row<any>) => void;
  statisticsTooltip?: string;
  startAction?: (row: Row<any>) => void;
  startTooltip?: string;
  redoAction?: (row: Row<any>) => void;
  redoTooltip?: string;
}

export interface ColumnUserActionSelection extends ColumnUserAction {
  row: Row<any>;
}

const UserActions = ({
  deleteAction,
  deleteTooltip,
  editAction,
  editTooltip,
  statisticsAction,
  statisticsTooltip,
  startAction,
  startTooltip,
  redoAction,
  redoTooltip,
  row,
}: ColumnUserActionSelection) => (
  <div className="testlab-table__user-action">
    {deleteAction && (
      <Button
        size="sm"
        variant="danger"
        onClick={() => {
          deleteAction(row);
        }}
        title={deleteTooltip}
      >
        &#10005;
      </Button>
    )}
    {editAction && (
      <Button
        size="sm"
        variant="info"
        onClick={() => {
          editAction(row);
        }}
        title={editTooltip}
      >
        &#9998;
      </Button>
    )}
    {statisticsAction && (
      <Button
        size="sm"
        variant="secondary"
        onClick={() => {
          statisticsAction(row);
        }}
        title={statisticsTooltip}
      >
        &#x2211;
      </Button>
    )}
    {startAction && (
      <Button
        size="sm"
        variant="success"
        onClick={() => {
          startAction(row);
        }}
        title={startTooltip}
      >
        &#9658;
      </Button>
    )}
    {redoAction && (
      <Button
        size="sm"
        variant="secondary"
        onClick={() => {
          redoAction(row);
        }}
        title={redoTooltip}
      >
        &#x21BB;
      </Button>
    )}
  </div>
);

export default UserActions;
