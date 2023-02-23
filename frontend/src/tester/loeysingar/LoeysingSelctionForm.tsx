import { ColumnDef } from '@tanstack/react-table';
import classNames from 'classnames';
import React, { useCallback, useMemo } from 'react';
import { Col, Container, Form, ListGroup, Row } from 'react-bootstrap';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { Navigate, useOutletContext } from 'react-router-dom';

import appRoutes from '../../common/appRoutes';
import { useDefaultStartStep } from '../../common/form/hooks/useSteps';
import useValidate from '../../common/form/hooks/useValidate';
import TestlabForm from '../../common/form/TestlabForm';
import IndeterminateCheckbox from '../../common/table/control/toggle/IndeterminateCheckbox';
import TestlabTable from '../../common/table/TestlabTable';
import { Loeysing } from '../../loeysingar/api/types';
import { MaalingInit } from '../../maaling/api/types';
import { TesterContext } from '../types';

export interface Props {
  label: string;
  formMethods: UseFormReturn<MaalingInit>;
  onSubmit: (maalingInit: MaalingInit) => void;
}

const LoeysingSelctionForm = ({ label, formMethods, onSubmit }: Props) => {
  const { formState } = formMethods;
  const { error, loading, loeysingList, maaling, refresh }: TesterContext =
    useOutletContext();

  const { control, setValue, setError, clearErrors } = formMethods;

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
    defaultValue: [],
  });

  const listErrors = formState.errors['loeysingList'];

  const selectedRows = useMemo(() => {
    const rowArray: boolean[] = [];
    loeysingList.forEach((tr) => (rowArray[tr.id - 1] = true));
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

  const step = useDefaultStartStep('..');

  if (maaling) {
    const maalingId = String(maaling.id);
    const path = appRoutes.CRAWLING_TEST.path.replace(':id', maalingId);
    return <Navigate to={path} />;
  }

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
