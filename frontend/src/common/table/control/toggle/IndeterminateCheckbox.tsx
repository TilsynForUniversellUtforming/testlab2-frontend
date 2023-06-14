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
}: Props & HTMLProps<HTMLInputElement>) => {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <>
      <label className="sr-only" htmlFor={id}>
        {ariaLabel}
      </label>
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
        id={id}
        title={ariaLabel}
      />
    </>
  );
};

export const HeaderCheckbox = <T extends object>({
  table,
}: {
  table: Table<T>;
}) => (
  <IndeterminateCheckbox
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
