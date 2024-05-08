import TestlabLinkButton from '@common/button/TestlabLinkButton';
import { Feature, isActive } from '@common/features/api/types';
import TestlabTable from '@common/table/TestlabTable';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { formatDateString } from '@common/util/stringutils';
import { Button, Heading, Table } from '@digdir/designsystemet-react';
import { SakListeElement } from '@sak/api/types';
import { SAK_CREATE } from '@sak/SakRoutes';
import { ColumnDef } from '@tanstack/react-table';
import { TEST } from '@test/TestingRoutes';
import React, { useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';

import { Kontroll } from '../../kontroll/types';
import classes from './sak-list.module.css';

const SakList = () => {
  const filters = [
    'Tilsyn',
    'Inngående kontroll',
    'Uttalesak',
    'Forenklet kontroll',
    'Statusmåling',
    'Annet',
  ];

  const [saker, kontroller, features] = useLoaderData() as [
    SakListeElement[],
    Kontroll[],
    Feature[],
  ];
  const navigate = useNavigate();
  const [filter, setFilter] = useState(filters[0]);

  const columns: Array<ColumnDef<SakListeElement>> = [
    { accessorKey: 'namn', header: 'Saker' },
    {
      accessorFn: (originalRow) => {
        return originalRow.ansvarleg?.namn ?? 'Ikkje tildelt';
      },
      header: 'Ansvarlig',
    },
    {
      accessorFn: (originalRow) => formatDateString(originalRow.frist),
      header: 'Frist',
    },
  ];

  return (
    <article className={classes.sakerOgKontroller}>
      <section className={classes.sakList}>
        <Heading level={1}>Alle saker</Heading>
        <TestlabLinkButton route={SAK_CREATE} title="Opprett ny">
          Opprett ny
        </TestlabLinkButton>
        <TestlabTable
          data={saker}
          defaultColumns={columns}
          filterPreference="none"
          onClickRow={(row) => {
            navigate(
              getFullPath(TEST, {
                pathParam: idPath,
                id: String(row?.original.id),
              })
            );
          }}
        />
      </section>

      {isActive(features, 'alleKontroller') && (
        <section className={classes.kontrollList}>
          <Heading level={1} size="xlarge">
            Alle kontroller
          </Heading>
          <div className={classes.filter}>
            {filters.map((s) => (
              <label key={s}>
                {s}
                <input
                  id={`filter-${slug(s)}`}
                  type="radio"
                  name="kontroller-filter"
                  hidden
                  value={s}
                  defaultChecked={s === filter}
                  onChange={(event) => setFilter(event.target.value)}
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
              {kontroller.map((kontroll) => (
                <Table.Row key={kontroll.id}>
                  <Table.Cell>{kontroll.tittel}</Table.Cell>
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
      )}
    </article>
  );
};

export default SakList;

function slug(s: string): string {
  return s
    .toLocaleLowerCase('no')
    .replaceAll(' ', '-')
    .replaceAll('æ', 'ae')
    .replaceAll('ø', 'oe')
    .replaceAll('å', 'aa');
}
