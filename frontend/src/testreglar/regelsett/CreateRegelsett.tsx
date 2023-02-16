import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useMemo } from 'react';
import {
  Col,
  Container,
  Row,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from 'react-bootstrap';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate, useOutletContext } from 'react-router-dom';

import StatusBadge from '../../common/status-badge/StatusBadge';
import IndeterminateCheckbox from '../../common/table/control/toggle/IndeterminateCheckbox';
import TestlabTable from '../../common/table/TestlabTable';
import { createRegelsett } from '../api/testreglar-api';
import { RegelsettRequest, Testregel, TestRegelsett } from '../api/types';
import { evneAlle, evneList, TestregelContext } from '../types';
import RegelsettForm from './RegelsettForm';

const CreateRegelsett = () => {
  const {
    error,
    loading,
    testreglar,
    setRegelsettList,
    setContextError,
    setLoading,
    refresh,
  }: TestregelContext = useOutletContext();

  const selectableTestreglar = useMemo<Testregel[]>(
    () => testreglar.filter((tr) => tr.referanseAct),
    [testreglar]
  );

  const navigate = useNavigate();
  const formMethods = useForm<TestRegelsett>({
    defaultValues: {
      namn: '',
      testregelList: [],
    },
  });

  const { control, setValue, setError, clearErrors } = formMethods;

  const validate = (selection: Testregel[]): boolean => {
    if (selection.length === 0) {
      setError('testregelList', {
        type: 'manual',
        message: 'Testreglar må veljast',
      });
      return false;
    } else {
      clearErrors('testregelList');
      return true;
    }
  };

  const onChangeRows = useCallback((rowSelection: Testregel[]) => {
    setValue('testregelList', rowSelection);
    validate(rowSelection);
  }, []);

  const selection = useWatch({
    control,
    name: 'testregelList',
    defaultValue: [],
  });

  const onSubmit = useCallback((regelsett: TestRegelsett) => {
    const validation = validate(regelsett.testregelList);
    if (!validation) {
      return;
    }

    const request: RegelsettRequest = {
      namn: regelsett.namn,
      ids: regelsett.testregelList.map((tr) => tr.id),
    };

    const addRegelsett = async () => {
      const data = await createRegelsett(request);
      setRegelsettList(data);
    };

    setLoading(true);
    setContextError(undefined);

    addRegelsett()
      .catch((e) => {
        setContextError(e.message);
      })
      .finally(() => {
        setLoading(false);
        navigate('..');
      });
  }, []);

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

  return (
    <Container className="pb-4">
      <Row>
        <Col>
          <RegelsettForm
            label="Nytt regelsett"
            formMethods={formMethods}
            selection={selection}
            onSubmit={onSubmit}
          />
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
