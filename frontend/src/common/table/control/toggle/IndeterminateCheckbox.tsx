import { CheckboxSize } from '@common/types';
import { Checkbox } from '@digdir/designsystemet-react';
import { Row, Table } from '@tanstack/react-table';
import React, { HTMLProps } from 'react';

interface Props {
  indeterminate?: boolean;
  ariaLabel?: string;
}

const IndeterminateCheckbox = ({
  indeterminate,
  checked,
  disabled,
  onChange,
  ariaLabel,
  id,
}: Props & HTMLProps<HTMLInputElement>) => (
  <>
    <label className="sr-only" htmlFor={id}>
      {ariaLabel}
    </label>
    <Checkbox
      value={String(id)}
      type="checkbox"
      indeterminate={indeterminate}
      checked={checked}
      disabled={disabled}
      onChange={onChange}
      aria-label={ariaLabel}
      id={id}
      title={ariaLabel}
      size={CheckboxSize.Small}
    />
  </>
);

export const HeaderCheckbox = <T extends object>({
  table,
}: {
  table: Table<T>;
}) => (
  <IndeterminateCheckbox
    id="alle-rader"
    checked={table.getIsAllRowsSelected()}
    indeterminate={table.getIsSomeRowsSelected()}
    onChange={table.getToggleAllRowsSelectedHandler()}
    ariaLabel="Velg alle rader"
  />
);

export const RowCheckbox = <T extends object>({
  row,
  ariaLabel,
}: {
  row: Row<T>;
  ariaLabel: string;
}) => (
  <IndeterminateCheckbox
    checked={row.getIsSelected()}
    disabled={!row.getCanSelect()}
    indeterminate={row.getIsSomeSelected()}
    onChange={row.getToggleSelectedHandler()}
    ariaLabel={ariaLabel}
    id={row.id}
  />
);
