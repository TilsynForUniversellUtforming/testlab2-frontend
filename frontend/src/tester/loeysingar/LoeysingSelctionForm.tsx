import { ColumnDef } from '@tanstack/react-table';
import classNames from 'classnames';
import React, { useCallback, useMemo } from 'react';
import { Col, Container, Form, ListGroup, Row } from 'react-bootstrap';
import { useForm, useWatch } from 'react-hook-form';
import { useOutletContext } from 'react-router-dom';

import useValidate from '../../common/form/hooks/useValidate';
import TestlabForm from '../../common/form/TestlabForm';
import { Step } from '../../common/form/TestlabFormButtons';
import IndeterminateCheckbox from '../../common/table/control/toggle/IndeterminateCheckbox';
import TestlabTable from '../../common/table/TestlabTable';
import { Loeysing } from '../../loeysingar/api/types';
import { Maaling, MaalingInit } from '../../maaling/api/types';
import { TesterContext } from '../types';

export interface Props {
  label: string;
  maaling?: Maaling;
  onSubmit: (maalingInit: MaalingInit) => void;
  step: Step;
}

const LoeysingSelctionForm = ({ label, maaling, onSubmit, step }: Props) => {
  const { error, loading, loeysingList, refresh }: TesterContext =
    useOutletContext();

  const formMethods = useForm<MaalingInit>({
    defaultValues: {
      navn: maaling?.navn ?? '',
      loeysingList: maaling?.loeysingList ?? [],
    },
  });

  const { control, setValue, setError, clearErrors } = formMethods;
  const { formState } = formMethods;

  const onChangeRows = useCallback((rowSelection: Loeysing[]) => {
    setValue('loeysingList', rowSelection);
    useValidate<Loeysing, MaalingInit>({
      selection: rowSelection,
      name: 'loeysingList',
      setError: setError,
      clearErrors: clearErrors,
      message: 'Løysingar må veljast',
    });
  }, []);

  const selection = useWatch({
    control,
    name: 'loeysingList',
  });

  const listErrors = formState.errors['loeysingList'];

  const selectedRows = useMemo(() => {
    const rowArray: boolean[] = [];
    maaling?.loeysingList.forEach((tr) => (rowArray[tr.id - 1] = true));
    return rowArray;
  }, []);

  const loeysingColumns = useMemo<ColumnDef<Loeysing>[]>(
    () => [
      {
        id: 'Handling',
        header: ({ table }) => (
          <IndeterminateCheckbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <IndeterminateCheckbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
        size: 1,
      },
      {
        accessorFn: (row) => row.namn,
        id: 'Navn',
        cell: (info) => info.getValue(),
        header: () => <span>Navn</span>,
      },
      {
        accessorFn: (row) => row.url,
        id: 'url',
        cell: (info) => info.getValue(),
        header: () => <span>URL</span>,
      },
    ],
    []
  );

  return (
    <Container className="pb-4">
      <TestlabForm<MaalingInit>
        label={label}
        onSubmit={onSubmit}
        formMethods={formMethods}
      >
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <TestlabForm.FormInput
                label="Navn"
                name="navn"
                formValidation={{
                  errorMessage: 'Navn kan ikke være tomt',
                  validation: { required: true, minLength: 1 },
                }}
              />
              <Form.Label>Valgte løysingar</Form.Label>
              <ListGroup as="ol" numbered={selection.length > 0}>
                {selection.length > 0 &&
                  selection.map((tr) => (
                    <ListGroup.Item key={tr.id} as="li">
                      {tr.url}
                    </ListGroup.Item>
                  ))}
                {selection.length === 0 && (
                  <ListGroup.Item
                    as="li"
                    className={classNames({ invalid: listErrors })}
                    disabled
                  >
                    Ingen løysingar valgt
                  </ListGroup.Item>
                )}
              </ListGroup>
              {listErrors && (
                <div className="invalid-feedback d-block">
                  {listErrors?.message}
                </div>
              )}
            </Form.Group>
          </Col>
          <Col>
            <TestlabTable<Loeysing>
              data={loeysingList}
              defaultColumns={loeysingColumns}
              error={error}
              loading={loading}
              selectedRows={selectedRows}
              onSelectRows={onChangeRows}
              onClickRetry={refresh}
              customStyle={{ small: true }}
            />
          </Col>
        </Row>
        <Row>
          <TestlabForm.FormButtons step={step} />
        </Row>
      </TestlabForm>
    </Container>
  );
};

export default LoeysingSelctionForm;
