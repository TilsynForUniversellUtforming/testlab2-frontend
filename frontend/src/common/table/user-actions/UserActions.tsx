import { Button, ButtonColor } from '@digdir/design-system-react';
import { Row } from '@tanstack/react-table';
import React from 'react';

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
        color={ButtonColor.Danger}
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
        color={ButtonColor.Inverted}
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
        color={ButtonColor.Secondary}
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
        color={ButtonColor.Success}
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
        color={ButtonColor.Secondary}
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
