import { ColumnDef } from '@tanstack/react-table';
import classNames from 'classnames';
import React, { useCallback, useMemo } from 'react';
import {
  Col,
  Container,
  Form,
  ListGroup,
  Row,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from 'react-bootstrap';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { useOutletContext } from 'react-router-dom';

import useValidate, {
  testreglarMessage,
} from '../../common/form/hooks/useValidate';
import TestlabForm from '../../common/form/TestlabForm';
import StatusBadge from '../../common/status-badge/StatusBadge';
import IndeterminateCheckbox from '../../common/table/control/toggle/IndeterminateCheckbox';
import TestlabTable from '../../common/table/TestlabTable';
import { Testregel, TestRegelsett } from '../api/types';
import { evneAlle, evneList, TestregelContext } from '../types';

export interface Props {
  label: string;
  regelsett?: TestRegelsett;
  formMethods: UseFormReturn<TestRegelsett>;
  onSubmit: (testregel: TestRegelsett) => void;
}

const RegelsettForm = ({ label, regelsett, formMethods, onSubmit }: Props) => {
  const { formState } = formMethods;
  const { error, loading, testreglar, refresh }: TestregelContext =
    useOutletContext();

  const { control, setValue, setError, clearErrors } = formMethods;

  const onChangeRows = useCallback((rowSelection: Testregel[]) => {
    setValue('testregelList', rowSelection);
    useValidate<Testregel, TestRegelsett>({
      selection: rowSelection,
      name: 'testregelList',
      setError: setError,
      clearErrors: clearErrors,
      message: testreglarMessage,
    });
  }, []);

  const selection = useWatch({
    control,
    name: 'testregelList',
    defaultValue: regelsett?.testregelList ?? [],
  });

  const listErrors = formState.errors['testregelList'];

  const selectableTestreglar = testreglar.filter((tr) => tr.referanseAct);

  const selectedRows = useMemo(() => {
    const rowArray: boolean[] = [];
    regelsett?.testregelList.forEach((tr) => (rowArray[tr.id - 1] = true));
    return rowArray;
  }, []);

  const testRegelColumns = useMemo<ColumnDef<Testregel>[]>(
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
        accessorFn: (row) => row.kravTilSamsvar,
        id: 'Navn',
        cell: (info) => info.getValue(),
        header: () => <span>Navn</span>,
      },
      {
        accessorFn: (row) => row.status,
        id: 'Status',
        cell: (info) => (
          <StatusBadge
            label={info.getValue()}
            levels={{
              primary: 'Publisert',
              danger: 'Utgår',
              success: 'Klar for testing',
            }}
          />
        ),
        header: () => <span>Status</span>,
      },
      {
        accessorFn: (row) => row.type,
        id: 'Type',
        cell: (info) => info.getValue(),
        header: () => <span>Type</span>,
      },
      {
        accessorFn: (row) => row.referanseAct,
        id: 'TestregelId',
        cell: (info) => info.getValue(),
        header: () => <span>Testregel</span>,
      },
      {
        accessorFn: (row) => row.kravTittel,
        id: 'Krav',
        cell: (info) => info.getValue(),
        header: () => <span>Krav</span>,
      },
    ],
    []
  );

  return (
    <Container className="pb-4">
      <TestlabForm<TestRegelsett>
        heading={label}
        onSubmit={onSubmit}
        formMethods={formMethods}
      >
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <TestlabForm.FormInput
                label="Navn"
                name="namn"
                formValidation={{
                  errorMessage: 'Navn kan ikke være tomt',
                  validation: { required: true, minLength: 1 },
                }}
              />
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
                    disabled
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
          </Col>
          <Col>
            <Stack gap={2}>
              <ToggleButtonGroup
                type="checkbox"
                className="mb-2"
                defaultValue={[evneAlle.value]}
              >
                {evneList.map((evne) => (
                  <ToggleButton
                    id={`${evne.value}-id`}
                    key={evne.value}
                    value={evne.value}
                    variant={'outline-primary'}
                    disabled
                  >
                    {evne.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              <TestlabTable<Testregel>
                data={selectableTestreglar}
                defaultColumns={testRegelColumns}
                error={error}
                loading={loading}
                selectedRows={selectedRows}
                onSelectRows={onChangeRows}
                onClickRetry={refresh}
                customStyle={{ small: true }}
              />
            </Stack>
          </Col>
        </Row>
        <Row>
          <TestlabForm.FormButtons />
        </Row>
      </TestlabForm>
    </Container>
  );
};

export default RegelsettForm;
