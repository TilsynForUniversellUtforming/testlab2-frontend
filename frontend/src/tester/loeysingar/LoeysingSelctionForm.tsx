import { ColumnDef } from '@tanstack/react-table';
import classNames from 'classnames';
import React, { useCallback, useMemo } from 'react';
import { Col, Container, Form, ListGroup, Row } from 'react-bootstrap';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { useOutletContext } from 'react-router-dom';

import { useDefaultStartStep } from '../../common/form/hooks/useSteps';
import useValidate from '../../common/form/hooks/useValidate';
import TestlabForm from '../../common/form/TestlabForm';
import IndeterminateCheckbox from '../../common/table/control/toggle/IndeterminateCheckbox';
import TestlabTable from '../../common/table/TestlabTable';
import { Loeysing } from '../api/types';
import { LoeysingList, TesterContext } from '../types';

export interface Props {
  label: string;
  formMethods: UseFormReturn<LoeysingList>;
  onSubmit: (loeysingList: LoeysingList) => void;
}

const LoeysingSelctionForm = ({ label, formMethods, onSubmit }: Props) => {
  const { formState } = formMethods;
  const { error, loading, loeysingList, refresh }: TesterContext =
    useOutletContext();

  const { control, setValue, setError, clearErrors } = formMethods;

  const onChangeRows = useCallback((rowSelection: Loeysing[]) => {
    setValue('loeysingList', rowSelection);
    useValidate<Loeysing, LoeysingList>({
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
    loeysingList?.loeysingList.forEach((tr) => (rowArray[tr.id - 1] = true));
    return rowArray;
  }, []);

  const loeysingColumns = React.useMemo<ColumnDef<Loeysing>[]>(
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
        header: () => <span>Addresse</span>,
      },
    ],
    []
  );

  const step = useDefaultStartStep('..');

  return (
    <Container className="pb-4">
      <Row>
        <Col>
          <TestlabForm<LoeysingList>
            label={label}
            onSubmit={onSubmit}
            formMethods={formMethods}
            step={step}
          >
            <Form.Group className="mb-3">
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
                  >
                    Ingen testregler valgt
                  </ListGroup.Item>
                )}
              </ListGroup>
              {listErrors && (
                <div className="invalid-feedback d-block">
                  {listErrors?.message}
                </div>
              )}
            </Form.Group>
          </TestlabForm>
        </Col>
        <Col>
          <TestlabTable<Loeysing>
            data={loeysingList.loeysingList}
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
    </Container>
  );
};

export default LoeysingSelctionForm;
