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
}: Props & HTMLProps<HTMLInputElement>) => {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      checked={checked}
      disabled={disabled}
      onChange={onChange}
      style={{
        width: '1rem',
        height: '1rem',
        cursor: 'pointer',
      }}
      aria-label={ariaLabel}
    />
  );
};

export const HeaderCheckbox = <T extends object>({
  table,
  ariaLabel,
}: {
  table: Table<T>;
  ariaLabel?: string;
}) => (
  <IndeterminateCheckbox
    checked={table.getIsAllRowsSelected()}
    indeterminate={table.getIsSomeRowsSelected()}
    onChange={table.getToggleAllRowsSelectedHandler()}
    ariaLabel={ariaLabel}
  />
);

export const RowCheckbox = <T extends object>({
  row,
  ariaLabel,
}: {
  row: Row<T>;
  ariaLabel?: string;
}) => (
  <IndeterminateCheckbox
    checked={row.getIsSelected()}
    disabled={!row.getCanSelect()}
    indeterminate={row.getIsSomeSelected()}
    onChange={row.getToggleSelectedHandler()}
    ariaLabel={ariaLabel}
  />
);
