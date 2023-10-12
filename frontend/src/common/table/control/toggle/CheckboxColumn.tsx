/**
 * Generates a checkbox column for selectable tables.
 *
 * @template T - Row data type.
 * @param {function(Row<T>): string} ariaLabelFunction - Returns an aria label for a given row.
 * @param {boolean} [useHeaderCheckbox] - Use a checkbox in the header for bulk selection.
 * @param {boolean} [useRowCheckbox=true] - Show a checkbox for each row.
 * @returns {ColumnDef<T>} The column definition for the checkbox column.
 */

import {
  HeaderCheckbox,
  RowCheckbox,
} from '@common/table/control/toggle/IndeterminateCheckbox';
import { CellCheckboxId } from '@common/table/types';
import { ColumnDef, Row } from '@tanstack/react-table';

export const getCheckboxColumn = <T extends object>(
  ariaLabelFunction: (row: Row<T>) => string,
  useHeaderCheckbox?: boolean,
  useRowCheckbox: boolean = true
): ColumnDef<T> => ({
  id: CellCheckboxId,
  header: ({ table }) =>
    useHeaderCheckbox ? (
      <HeaderCheckbox table={table} />
    ) : (
      <span className="sr-only">Velg alle</span>
    ),
  cell: ({ row }) =>
    useRowCheckbox && (
      <RowCheckbox row={row} ariaLabel={ariaLabelFunction(row)} />
    ),
  size: 1,
});
