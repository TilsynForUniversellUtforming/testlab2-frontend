import React, { ChangeEvent, FormEvent, ReactNode } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { Option } from '../types';

export interface Props {
  title?: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}

export interface EditSelectProps {
  label: string;
  value?: string | number;
  options: Option[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export interface EditInputProps {
  label: string;
  value?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const EditSelect = ({ label, value, options, onChange }: EditSelectProps) => (
  <Form.Group className="mb-3">
    <Form.Label column htmlFor={label} className="p-0">
      {label}
    </Form.Label>
    <Form.Select
      aria-label={label}
      id={label}
      value={value}
      onChange={onChange}
    >
      {options.map((option) => (
        <option value={option.value} key={option.value}>
          {option.label}
        </option>
      ))}
    </Form.Select>
  </Form.Group>
);

const EditInput = ({ label, value, onChange }: EditInputProps) => (
  <Form.Group className="mb-3">
    <Form.Label>{label}</Form.Label>
    <Form.Control value={value} onChange={onChange} />
  </Form.Group>
);

const EditForm = ({ title, children, onSubmit }: Props) => {
  const navigate = useNavigate();

  return (
    <>
      {title && <h3 className="mb-4">{title}</h3>}
      <Form className="mb-4" onSubmit={onSubmit}>
        {children}
        <Button
          variant="secondary"
          className="me-3"
          onClick={() => navigate('..')}
        >
          Tilbake
        </Button>
        <Button type="submit">Lagre</Button>
      </Form>
    </>
  );
};

EditForm.EditInput = EditInput;
EditForm.EditSelect = EditSelect;

export default EditForm;
