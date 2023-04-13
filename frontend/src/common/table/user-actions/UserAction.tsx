import { Button, ButtonColor } from '@digdir/design-system-react';
import {
  BarChart2Icon,
  CloseIcon,
  EditIcon,
  PlayIcon,
  RepeatIcon,
} from '@digdir/ds-icons';
import { Row } from '@tanstack/react-table';
import React from 'react';

import ConfirmModalButton from '../../confirm/ConfirmModalButton';

export type ColumnUserAction =
  | 'delete'
  | 'edit'
  | 'statistics'
  | 'start'
  | 'redo';

export interface Props<T extends object> {
  action: (row: Row<T>) => void;
  row: Row<T>;
  columnUserAction: ColumnUserAction;
  title: string;
  message: string;
  confirm?: boolean;
}

const ActionIcon = ({
  columnUserAction,
}: {
  columnUserAction: ColumnUserAction;
}) => {
  switch (columnUserAction) {
    case 'delete':
      return <CloseIcon color="white" />;
    case 'edit':
      return <EditIcon color="white" />;
    case 'statistics':
      return <BarChart2Icon color="white" />;
    case 'start':
      return <PlayIcon color="white" />;
    case 'redo':
      return <RepeatIcon color="white" />;
  }
};

const getButtonColor = (columnUserAction: ColumnUserAction) => {
  switch (columnUserAction) {
    case 'delete':
      return ButtonColor.Danger;
    case 'edit':
      return ButtonColor.Primary;
    case 'statistics':
      return ButtonColor.Secondary;
    case 'start':
      return ButtonColor.Success;
    case 'redo':
      return ButtonColor.Secondary;
  }
};

const UserAction = <T extends object>({
  action,
  row,
  columnUserAction,
  title,
  message,
  confirm = false,
}: Props<T>) => (
  <div className="testlab-table__user-action">
    {confirm && (
      <ConfirmModalButton
        color={getButtonColor(columnUserAction)}
        onConfirm={() => {
          action(row);
        }}
        icon={<ActionIcon columnUserAction={columnUserAction} />}
        title={title}
        message={message}
      />
    )}
    {!confirm && (
      <Button
        onClick={() => {
          action(row);
        }}
        icon={<ActionIcon columnUserAction={columnUserAction} />}
        color={getButtonColor(columnUserAction)}
        title={title}
      />
    )}
  </div>
);

export default UserAction;
