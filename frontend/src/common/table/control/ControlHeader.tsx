import { Table } from '@tanstack/react-table';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import DebouncedInput from '../../DebouncedInput';
import PageSizeSelection from './pagination/PageSizeSelection';

export interface Props {
  loading: boolean;
  table: Table<any>;
  showFilters: boolean;
  filterValue: string;
  onChangeFilter: (value: string | number) => void;
  small?: boolean;
}

const ControlHeader = ({
  loading,
  table,
  showFilters,
  filterValue,
  onChangeFilter,
  small = false,
}: Props) => {
  if (small) {
    return null;
  }

  return (
    <Container className="pb-4">
      <Row>
        <Col>
          <PageSizeSelection table={table} loading={loading} />
        </Col>
        <Col className="d-flex flex-row-reverse">
          {showFilters && (
            <DebouncedInput
              value={filterValue}
              onChange={onChangeFilter}
              placeholder="Søk..."
              className="w-50 h-25"
            />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ControlHeader;
