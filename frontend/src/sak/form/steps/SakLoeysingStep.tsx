import { ColumnDef } from '@tanstack/react-table';
import classNames from 'classnames';
import React, { useMemo } from 'react';
import { Col, Form, ListGroup } from 'react-bootstrap';
import { useForm, useWatch } from 'react-hook-form';

import useValidate from '../../../common/form/hooks/useValidate';
import { TestlabFormButtonStep } from '../../../common/form/TestlabFormButtons';
import IndeterminateCheckbox from '../../../common/table/control/toggle/IndeterminateCheckbox';
import TestlabTable from '../../../common/table/TestlabTable';
import { Loeysing } from '../../../loeysingar/api/types';
import { SakFormBaseProps, SakFormState } from '../../types';
import SakFormContainer from '../SakFormContainer';

interface Props extends SakFormBaseProps {
  error: any;
  loading: boolean;
  onSubmit: (maalingFormState: SakFormState) => void;
  loeysingList: Loeysing[];
  onClickBack: () => void;
}

const SakLoeysingStep = ({
  heading,
  subHeading,
  onClickBack,
  error,
  loading,
  onSubmit,
  maalingFormState,
  loeysingList,
}: Props) => {
  const formMethods = useForm<SakFormState>({
    defaultValues: maalingFormState,
  });

  const { control, setValue, setError, clearErrors, formState } = formMethods;

  const onChangeRows = (rowSelection: Loeysing[]) => {
    setValue('loeysingList', rowSelection);
    useValidate<Loeysing, SakFormState>({
      selection: rowSelection,
      name: 'loeysingList',
      setError: setError,
      clearErrors: clearErrors,
      message: 'Løysingar må veljast',
    });
  };

  const selection = useWatch({
    control,
    name: 'loeysingList',
  });

  const listErrors = formState.errors['loeysingList'];

  const selectedRows = useMemo(() => {
    const rowArray: boolean[] = [];
    maalingFormState?.loeysingList.forEach(
      (tr) => (rowArray[tr.id - 1] = true)
    );
    return rowArray;
  }, [maalingFormState]);

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

  const buttonStep: TestlabFormButtonStep = {
    stepType: 'Middle',
    onClickBack: onClickBack,
  };

  return (
    <SakFormContainer
      heading={heading}
      subHeading={subHeading}
      formMethods={formMethods}
      onSubmit={onSubmit}
      buttonStep={buttonStep}
    >
      <>
        <Col>
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
            customStyle={{ small: true }}
          />
        </Col>
      </>
    </SakFormContainer>
  );
};

export default SakLoeysingStep;
