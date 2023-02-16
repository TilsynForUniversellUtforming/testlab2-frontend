import classNames from 'classnames';
import React from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import { UseFormReturn } from 'react-hook-form';

import TestlabForm from '../../common/form/TestlabForm';
import { Testregel, TestRegelsett } from '../api/types';

export interface Props {
  label: string;
  formMethods: UseFormReturn<TestRegelsett>;
  selection: Testregel[];
  onSubmit: (testregel: TestRegelsett) => void;
}

const RegelsettForm = ({ label, formMethods, selection, onSubmit }: Props) => {
  const { formState } = formMethods;

  const listErrors = formState.errors['testregelList'];

  return (
    <TestlabForm<TestRegelsett>
      label={label}
      onSubmit={onSubmit}
      formMethods={formMethods}
    >
      <TestlabForm.FormInput
        label="Navn"
        name="namn"
        formValidation={{
          errorMessage: 'Navn kan ikke være tomt',
          validation: { required: true, minLength: 1 },
        }}
      />
      <Form.Group className="mb-3">
        <Form.Label>Valgte regelsett</Form.Label>
        <ListGroup
          className="testreglar-regelsett__list"
          as="ol"
          numbered={selection.length > 0}
        >
          {selection.length > 0 &&
            selection.map((tr) => (
              <ListGroup.Item key={tr.id} as="li">
                {tr.kravTilSamsvar}
              </ListGroup.Item>
            ))}
          {selection.length === 0 && (
            <ListGroup.Item
              as="li"
              className={classNames({ invalid: listErrors })}
            >
              Ingen testregler valgt
            </ListGroup.Item>
          )}
        </ListGroup>
        {listErrors && (
          <div className="invalid-feedback d-block">{listErrors?.message}</div>
        )}
      </Form.Group>
    </TestlabForm>
  );
};

export default RegelsettForm;
