import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useState } from 'react';
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

import DigdirButton from '../../common/button/DigdirButton';
import useFormatDate from '../../common/hooks/useFormatDate';
import useValidate from '../../common/hooks/useValidate';
import StatusBadge from '../../common/status-badge/StatusBadge';
import IndeterminateCheckbox from '../../common/table/control/toggle/IndeterminateCheckbox';
import DigdirTable from '../../common/table/DigdirTable';
import { createRegelsett_dummy } from '../api/testreglar-api_dummy';
import { RegelsettRequest, Testregel } from '../api/types';
import { evneAlle, evneList, TestregelContext } from '../types';

const CreateRegelsett = () => {
  const {
    error,
    loading,
    testreglar,
    setRegelsett,
    setError,
    setLoading,
  }: TestregelContext = useOutletContext();

  const navigate = useNavigate();
  const [selection, setSelection] = useState<Testregel[]>([]);
  const [name, setName] = useState<string>();

  const onChangeRows = useCallback((rowSelection: Testregel[]) => {
    setSelection(rowSelection);
  }, []);

  const validateRequest = (): RegelsettRequest => {
    useValidate([
      { validationType: 'name', value: name },
      { validationType: 'array', value: selection },
    ]);

    return {
      namn: name!,
      ids: selection.map((tr) => tr.Id),
    };
  };

  const onSubmit = useCallback(() => {
    const request = validateRequest();

    const fetchTestreglar = async () => {
      const data = await createRegelsett_dummy(request);
      console.log('data', data);
      setRegelsett(data);
    };

    setLoading(true);
    setError(undefined);

    fetchTestreglar()
      .catch((e) => setError(e))
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
        accessorFn: (row) => row.Navn,
        id: 'Navn',
        cell: (info) => info.getValue(),
        header: () => <span>Navn</span>,
      },
      {
        accessorFn: (row) => row.Status,
        id: 'Status',
        cell: (info) => (
          <StatusBadge
            title={`${info.getValue()}`}
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
        accessorFn: (row) => row.Dato_endra,
        id: 'Dato_endra',
        cell: (info) => useFormatDate(String(info.getValue())),
        header: () => <span>Dato Endra</span>,
      },
      {
        accessorFn: (row) => row.Type,
        id: 'Type',
        cell: (info) => info.getValue(),
        header: () => <span>Type</span>,
      },
      {
        accessorFn: (row) => row.TestregelId,
        id: 'TestregelId',
        cell: (info) => info.getValue(),
        header: () => <span>Testregel</span>,
      },
      {
        accessorFn: (row) => row.Krav,
        id: 'Krav',
        cell: (info) => info.getValue(),
        header: () => <span>Krav</span>,
      },
    ],
    []
  );

  const submitDisabled =
    loading ||
    selection.length === 0 ||
    !useValidate([{ validationType: 'name', value: name }]);

  return (
    <Container className="pb-4">
      <Row>
        <Col>
          <Form>
            <Form.Group className="mb-3">
              <DigdirButton
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
                    <ListGroup.Item key={tr.Navn} as="li">
                      {tr.Navn}
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
                >
                  {evne.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <DigdirTable<Testregel>
              data={testreglar}
              defaultColumns={testRegelColumns}
              error={error}
              loading={loading}
              onSelectRows={onChangeRows}
              customStyle={{ small: true }}
            />
          </Stack>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateRegelsett;
