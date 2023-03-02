import React from 'react';
import { ListGroup, Spinner, Stack } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';

import ErrorCard from '../common/error/ErrorCard';
import { SakContext } from './types';

const Sak = () => {
  const { loading, error, maaling }: SakContext = useOutletContext();

  if (loading) {
    return <Spinner />;
  }

  if (!maaling || error) {
    return <ErrorCard />;
  }

  const { navn, loeysingList } = maaling;

  return (
    <Stack gap={5}>
      <div>
        <h4>Namn</h4>
        <div>{navn}</div>
      </div>
      <div>
        <h4>Løysingar</h4>
        <ListGroup as="ol" className="w-50 ">
          {loeysingList.map((lo) => (
            <ListGroup.Item key={lo.id} as="li">
              <div className="fw-bold">{lo.namn}</div>
              {lo.url}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
      {/*<div>*/}
      {/*  <h4>Regelsett</h4>*/}
      {/*    <Accordion className="w-50">*/}
      {/*      <Accordion.Item eventKey="0">*/}
      {/*        <Accordion.Header>*/}
      {/*          {regelsett.namn} ({regelsett.testregelList.length})*/}
      {/*        </Accordion.Header>*/}
      {/*        <Accordion.Body>*/}
      {/*          <ListGroup>*/}
      {/*            {regelsett.testregelList.map((tr) => (*/}
      {/*              <ListGroup.Item key={tr.id} as="li">*/}
      {/*                <div className="fw-bold">{tr.kravTilSamsvar}</div>*/}
      {/*                {tr.referanseAct}*/}
      {/*              </ListGroup.Item>*/}
      {/*            ))}*/}
      {/*          </ListGroup>*/}
      {/*        </Accordion.Body>*/}
      {/*      </Accordion.Item>*/}
      {/*    </Accordion>*/}
      {/*  )*/}
      {/*</div>*/}
    </Stack>
  );
};

export default Sak;
