import { Table } from '@tanstack/react-table';

export interface TableProps {
  table: Table<any>;
}

export interface LoadingTableProps extends TableProps {
  loading: boolean;
}
