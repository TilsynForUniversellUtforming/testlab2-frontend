import React from 'react';
import { ListGroup, Spinner, Stack } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';

import ErrorCard from '../../common/error/ErrorCard';
import { SakContext } from '../types';

const SakOverview = () => {
  const { loading, error, maaling }: SakContext = useOutletContext();

  if (loading) {
    return (
      <Spinner
        as="span"
        animation="border"
        size="sm"
        role="status"
        aria-hidden="true"
      />
    );
  }

  if (!maaling || error) {
    return <ErrorCard />;
  }

  return (
    <Stack gap={5}>
      <div>
        <h4>Løysingar</h4>
        <ListGroup as="ol" className="w-50 ">
          {maaling.loeysingList.map((lo) => (
            <ListGroup.Item key={lo.id} as="li">
              <div className="fw-bold">{lo.namn}</div>
              {lo.url}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </Stack>
  );
};

export default SakOverview;
