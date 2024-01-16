import { ConfirmModalProps } from '@common/confirm-modal/ConfirmModalButton';
import { AppRoute } from '@common/util/routeUtils';
import { Table } from '@tanstack/react-table';

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

export type TableFilterPreference = 'all' | 'none' | 'searchbar';

export type Action = 'add' | 'delete' | 'restart' | 'save';

export type LegacyTableRowAction = {
  action: Action;
  route?: AppRoute;
  modalProps?: ConfirmModalProps;
  rowSelectionRequired?: boolean;
};

export const CellCheckboxId = 'handling';
