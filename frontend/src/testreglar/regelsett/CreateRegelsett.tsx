import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useMemo, useState } from 'react';
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
import { useNavigate, useOutletContext } from 'react-router-dom';

import UserActionButton from '../../common/button/UserActionButton';
import useValidate from '../../common/hooks/useValidate';
import StatusBadge from '../../common/status-badge/StatusBadge';
import IndeterminateCheckbox from '../../common/table/control/toggle/IndeterminateCheckbox';
import TestlabTable from '../../common/table/TestlabTable';
import { createRegelsett } from '../api/testreglar-api';
import { RegelsettRequest, Testregel } from '../api/types';
import { evneAlle, evneList, TestregelContext } from '../types';

const CreateRegelsett = () => {
  const {
    error,
    loading,
    testreglar,
    setRegelsettList,
    setError,
    setLoading,
    refresh,
  }: TestregelContext = useOutletContext();

  const selectableTestreglar = useMemo<Testregel[]>(
    () => testreglar.filter((tr) => tr.referanseAct),
    [testreglar]
  );

  const navigate = useNavigate();
  const [selection, setSelection] = useState<Testregel[]>([]);
  const [name, setName] = useState<string>();

  const onChangeRows = useCallback((rowSelection: Testregel[]) => {
    setSelection(rowSelection);
  }, []);

  const validateRequest = (): RegelsettRequest => {
    const valid = useValidate([
      { value: name },
      { isArray: true, value: selection },
    ]);

    if (!valid) {
      throw new Error('Ugyldig regelsett');
    }

    return {
      namn: name!,
      ids: selection.map((tr) => tr.id),
    };
  };

  const onSubmit = useCallback(() => {
    const request = validateRequest();

    const addRegelsett = async () => {
      const data = await createRegelsett(request);
      setRegelsettList(data);
    };

    setLoading(true);
    setError(undefined);

    addRegelsett()
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => {
        setLoading(false);
        navigate('..');
      });
  }, [selection]);

  const testRegelColumns = React.useMemo<ColumnDef<Testregel>[]>(
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

  const submitDisabled =
    loading || selection.length === 0 || !useValidate([{ value: name }]);
  return (
    <Container className="pb-4">
      <Row>
        <Col>
          <Form>
            <Form.Group className="mb-3">
              <UserActionButton
                type="submit"
                disabled={submitDisabled}
                onClick={onSubmit}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="formCreateRegelsettName">Navn</Form.Label>
              <Form.Control
                id="formCreateRegelsettName"
                size="sm"
                type="text"
                value={name ?? ''}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
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
                  <ListGroup.Item as="li">
                    Ingen testregler valgt
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Form.Group>
          </Form>
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
              onSelectRows={onChangeRows}
              onClickRetry={refresh}
              customStyle={{ small: true }}
            />
          </Stack>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateRegelsett;
