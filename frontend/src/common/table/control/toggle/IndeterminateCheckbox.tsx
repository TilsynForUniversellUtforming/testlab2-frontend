import React, { HTMLProps } from 'react';

interface Props {
  indeterminate?: boolean;
}

const IndeterminateCheckbox = ({
  indeterminate,
  checked,
  disabled,
  onChange,
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
    />
  );
};

export default IndeterminateCheckbox;
