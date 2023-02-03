import { Form } from 'react-bootstrap';

import { SelectOption } from '../../common/types';

export interface Props {
  selected?: string;
  options: SelectOption[];
  onChange: (e?: any) => void;
}

function RegelsettSelect({ selected, options, onChange }: Props) {
  return (
    <Form.Select
      aria-label="Velg regelsett"
      value={selected}
      onChange={onChange}
      className="mb-3"
    >
      <option>Velg regelsett</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Form.Select>
  );
}

export default RegelsettSelect;
