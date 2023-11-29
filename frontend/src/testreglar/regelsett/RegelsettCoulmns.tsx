import { getCheckboxColumn } from '@common/table/control/toggle/CheckboxColumn';
import { sanitizeEnumLabel } from '@common/util/stringutils';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Regelsett } from '@testreglar/api/types';

/**
 * getRegelsettColumns function returns an array of column definitions for Regelsett.
 *
 * @returns {Array<ColumnDef<Regelsett>>} An array of column definitions.
 */
export const getRegelsettColumns = (): Array<ColumnDef<Regelsett>> => [
  getCheckboxColumn((row: Row<Regelsett>) => `Velg ${row.original.namn}`),
  {
    header: () => <>Namn</>,
    accessorFn: (row) => row.namn,
    id: 'regelsett-namn',
    cell: (info) => info.getValue(),
  },
  {
    header: () => <>Type</>,
    accessorFn: (row) => row.type,
    id: 'type',
    cell: (info) => sanitizeEnumLabel(String(info.getValue())),
    meta: {
      select: true,
    },
  },
  {
    header: () => <>Standard regelsett</>,
    accessorFn: (row) => (row.standard ? 'ja' : 'nei'),
    id: 'standard',
    cell: ({ row }) => <>{row.original.standard ? 'Ja' : 'Nei'}</>,
    meta: {
      select: true,
    },
  },
  {
    header: () => <>Antall testreglar</>,
    accessorFn: (row) => row.testregelList.length,
    id: 'Testregel',
    cell: ({ row }) => <>{row.original.testregelList.length}</>,
  },
];
