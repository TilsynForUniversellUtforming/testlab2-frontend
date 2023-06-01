import './standard-table.scss';

import React from 'react';

import AppTitle from '../app-title/AppTitle';
import TableActionButton, {
  TableActionButtonProps,
} from '../button/TableActionButton';
import TestlabTable, { TestlabTableProps } from './TestlabTable';

export interface Props<T extends object> {
  heading: string;
  actionButtons: TableActionButtonProps[];
  tableProps: TestlabTableProps<T>;
}

/**
 * Table wrapper with title and buttons for user actions and confirmation dialog.
 * @template T The type of data to be displayed in the table.
 * @param {object} props - The props for the component.
 * @param {string} props.heading - The title to be displayed at the top of the table.
 * @param {TableActionButtonProps[]} props.actionButtons - List of buttons which routes the user to a new page to preform actions, ie. create new elements.
 * @param {TestlabTableProps<T>} props.tableProps - The props for the TestlabTable component.
 * @returns {JSX.Element} - A JSX.Element representing the StandardTable component.
 */
const UserActionTable = <T extends object>({
  heading,
  actionButtons,
  tableProps,
}: Props<T>) => {
  return (
    <div className="standard-table">
      <AppTitle heading={heading} />

      {actionButtons.length > 0 && (
        <div className="standard-table__user-actions">
          {actionButtons.map((button, i) => (
            <div
              className="standard-table__action"
              key={`${button.action}_${i}`}
            >
              <TableActionButton {...button} />
            </div>
          ))}
        </div>
      )}
      <TestlabTable<T> {...tableProps} />
    </div>
  );
};

export default UserActionTable;
