import './standard-table.scss';

import React from 'react';

import AppTitle from '../app-title/AppTitle';
import { AppRoute } from '../appRoutes';
import TableActionButton from '../button/TableActionButton';
import ConfirmModalButton, {
  ConfirmModalProps,
} from '../confirm/ConfirmModalButton';
import TestlabTable, { TestlabTableProps } from './TestlabTable';

export interface Props<T extends object> {
  heading: string;
  createRoute: AppRoute;
  deleteConfirmationModalProps: ConfirmModalProps;
  tableProps: TestlabTableProps<T>;
}

/**
 * Table wrapper with title and buttons for user actions and confirmation dialog.
 * @template T The type of data to be displayed in the table.
 * @param {object} props - The props for the component.
 * @param {string} props.heading - The title to be displayed at the top of the table.
 * @param {AppRoute} props.createRoute - The route to navigate to when the add button is clicked.
 * @param {ConfirmModalProps} props.deleteConfirmationModalProps - The props for the ConfirmModalButton component, displayed when deleting element.
 * @param {TestlabTableProps<T>} props.tableProps - The props for the TestlabTable component.
 * @returns {JSX.Element} - A JSX.Element representing the StandardTable component.
 */
const UserActionTable = <T extends object>({
  heading,
  createRoute,
  deleteConfirmationModalProps,
  tableProps,
}: Props<T>) => {
  return (
    <div className="standard-table">
      <AppTitle heading={heading} />
      <div className="standard-table__user-actions">
        <div className="standard-table__action">
          <TableActionButton action="add" route={createRoute} />
        </div>
        <div className="standard-table__action">
          <ConfirmModalButton {...deleteConfirmationModalProps} />
        </div>
      </div>
      <TestlabTable<T> {...tableProps} />
    </div>
  );
};

export default UserActionTable;
