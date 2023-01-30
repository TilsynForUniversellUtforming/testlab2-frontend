import React from 'react';
import { Button, Form, InputGroup, Spinner } from 'react-bootstrap';

export interface Props {
  value?: string;
  error?: string;
  loading: boolean;
  onChange: (e: string) => void;
  onSubmit: () => void;
}

const TestParameters = ({
  value,
  error,
  loading,
  onChange,
  onSubmit,
}: Props) => {
  const validated = typeof error === 'undefined';

  return (
    <div className="w-50 d-inline-flex">
      <InputGroup hasValidation>
        <Form.Control
          type="text"
          value={value}
          placeholder="Skriv inn nettsted"
          aria-label="Inputfelt for nettsted"
          onChange={(e) => onChange(e.target.value)}
          required
          isInvalid={!validated}
        />
        <Button
          variant="outline-success"
          id="button-addon2"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? 'Laster...' : 'Start test'}
          {loading && (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          )}
        </Button>
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      </InputGroup>
    </div>
  );
};

export default TestParameters;
