import './standard-table.scss';

import React from 'react';

import AppTitle, { AppTitleProps } from '../app-title/AppTitle';
import TableActionButton, {
  TableActionButtonProps,
} from '../button/TableActionButton';
import MenuDropdown, { MenuDropdownProps } from '../dropdown/MenuDropdown';
import TestlabTable, { TestlabTableProps } from './TestlabTable';

export interface Props<T extends object> extends AppTitleProps {
  actionButtons?: TableActionButtonProps[];
  menuButtons?: MenuDropdownProps;
  tableProps: TestlabTableProps<T>;
}

/**
 * Table wrapper with title and buttons for user actions and confirmation dialog.
 * @template T The type of data to be displayed in the table.
 * @param {object} props - The props for the component.
 * @param {string} props.heading - The heading of the table.
 * @param {string} props.subHeading - The subheading of the table.
 * @param {AppRoute} props.linkPath - Optional link used in the subheading.
 * @param {TableActionButtonProps[]} props.actionButtons - List of buttons which routes the user to a new page to preform actions, ie. create new elements.
 * @param {TestlabTableProps<T>} props.tableProps - The props for the TestlabTable component.
 * @param {MenuDropdownProps} props.menuButtons - The props for the menu dropdown component.
 * @returns {JSX.Element} - A JSX.Element representing the StandardTable component.
 */
const UserActionTable = <T extends object>({
  heading,
  subHeading,
  linkPath,
  actionButtons,
  tableProps,
  menuButtons,
}: Props<T>) => {
  return (
    <div className="standard-table">
      <AppTitle heading={heading} subHeading={subHeading} linkPath={linkPath} />

      {actionButtons && actionButtons.length > 0 && (
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
      {menuButtons && (
        <MenuDropdown title={menuButtons.title} actions={menuButtons.actions} />
      )}
      <TestlabTable<T> {...tableProps} />
    </div>
  );
};

export default UserActionTable;
