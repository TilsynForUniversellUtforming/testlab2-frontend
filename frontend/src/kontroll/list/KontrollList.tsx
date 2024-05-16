import { Button, Heading, Table } from '@digdir/designsystemet-react';
import React, { useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';

import { KontrollListItem } from '../types';
import classes from './kontroll-list.module.css';

type Filter =
  | 'tilsyn'
  | 'inngaaende-kontroll'
  | 'uttalesak'
  | 'forenklet-kontroll'
  | 'statusmaaling'
  | 'annet';

function viewFilter(filter: Filter) {
  switch (filter) {
    case 'tilsyn':
      return 'Tilsyn';
    case 'inngaaende-kontroll':
      return 'Inngående kontroll';
    case 'uttalesak':
      return 'Uttale';
    case 'forenklet-kontroll':
      return 'Forenklet kontroll';
    case 'statusmaaling':
      return 'Statusmåling';
    case 'annet':
      return 'Annet';
  }
}

const KontrollList = () => {
  const filters: Filter[] = [
    'tilsyn',
    'inngaaende-kontroll',
    'uttalesak',
    'forenklet-kontroll',
    'statusmaaling',
    'annet',
  ];

  const kontroller = useLoaderData() as KontrollListItem[];
  const [kontrollFilter, setKontrollFilter] = useState<Filter>(filters[1]);

  return (
    <section className={classes.kontrollList}>
      <Heading level={1} size="xlarge">
        Alle kontroller
      </Heading>
      <div className={classes.filter}>
        {filters.map((s) => (
          <label key={s}>
            {viewFilter(s)}
            <input
              id={`filter-${s}`}
              type="radio"
              name="kontroller-filter"
              hidden
              value={s}
              defaultChecked={s === kontrollFilter}
              onChange={(event) =>
                setKontrollFilter(event.target.value as Filter)
              }
            />
          </label>
        ))}
      </div>
      <Table className={classes.kontrollerTabell}>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>Tittel</Table.HeaderCell>
            <Table.HeaderCell>Virksomhet</Table.HeaderCell>
            <Table.HeaderCell>Ansvarlig</Table.HeaderCell>
            <Table.HeaderCell>Frister</Table.HeaderCell>
            <Table.HeaderCell>Progresjon</Table.HeaderCell>
            <Table.HeaderCell>Merknad</Table.HeaderCell>
            <Table.HeaderCell>Testtype</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {kontroller
            .filter((k) => kontrollFilter === k.kontrolltype)
            .map((kontroll) => (
              <Table.Row key={kontroll.id}>
                <Table.Cell>
                  <Link to={`/kontroll/${kontroll.id}/oppsummering`}>
                    {kontroll.tittel}
                  </Link>
                </Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell>{kontroll.saksbehandler}</Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell>
                  <Button variant="tertiary">Ny merknad</Button>
                </Table.Cell>
                <Table.Cell>Inngående kontroll</Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </section>
  );
};

export default KontrollList;
