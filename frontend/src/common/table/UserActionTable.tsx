import './standard-table.scss';

import React, { ReactElement, ReactNode } from 'react';

import AppTitle, { AppTitleProps } from '../app-title/AppTitle';
import TestlabTable, { TestlabTableProps } from './TestlabTable';

export interface Props<T extends object> extends AppTitleProps {
  children?: ReactNode;
  tableProps: TestlabTableProps<T>;
}

/**
 * Table wrapper with title and buttons for user actions and confirmation dialog.
 * @template T The type of data to be displayed in the table.
 * @param {object} props - The props for the component.
 * @param {string} props.heading - The heading of the table.
 * @param {string} props.subHeading - The subheading of the table.
 * @param {AppRoute} props.linkPath - Optional link used in the subheading.
 * @param {ReactNode} props.children - React component to display before table
 * @param {TestlabTableProps<T>} props.tableProps - The props for the TestlabTable component.
 * @returns {ReactElement} - A JSX.Element representing the StandardTable component.
 */
const UserActionTable = <T extends object>({
  heading,
  subHeading,
  linkPath,
  children,
  tableProps,
}: Props<T>): ReactElement => (
  <div className="standard-table">
    <AppTitle heading={heading} subHeading={subHeading} linkPath={linkPath} />
    {children}
    <TestlabTable<T> {...tableProps} />
  </div>
);

export default UserActionTable;
