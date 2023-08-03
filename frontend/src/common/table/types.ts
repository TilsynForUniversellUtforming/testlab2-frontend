import { Table } from '@tanstack/react-table';

import { ConfirmModalProps } from '../confirm/ConfirmModalButton';

export interface TableProps<T> {
  table: Table<T>;
}

export interface LoadingTableProps<T> extends TableProps<T> {
  loading: boolean;
}

export type TableStyle = {
  full?: boolean;
  small?: boolean;
  fixed?: boolean;
};

export type TableFilterPreference = 'all' | 'none' | 'searchbar' | 'rowsearch';

export type RowActionType = 'delete' | 'restart';

export type TableRowAction = {
  action: RowActionType;
  modalProps: ConfirmModalProps;
};

export const CellCheckboxId = 'handling';
