import { Table } from '@tanstack/react-table';

export interface TableProps {
  table: Table<any>;
}

export interface LoadingTableProps extends TableProps {
  loading: boolean;
}

export type TableStyle = {
  full?: boolean;
  small?: boolean;
  fixed?: boolean;
};

export type TableFilterPreference = 'all' | 'none' | 'searchbar' | 'rowsearch';
