import { search } from '@common/util/arrayUtils';
import { sanitizeEnumLabel } from '@common/util/stringutils';
import {
  Button,
  Heading,
  Table,
  Textfield,
} from '@digdir/designsystemet-react';
import React, { ChangeEvent, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';

import { KontrollListItem, KontrollType, Orgnummer } from '../types';
import classes from './kontroll-list.module.css';

const KontrollList = () => {
  const filters: string[] = Object.values(KontrollType);

  const kontroller = useLoaderData() as KontrollListItem[];
  const [kontrollFilter, setKontrollFilter] = useState<KontrollType>(
    KontrollType.InngaaendeKontroll
  );
  const [searchResult, setSearchResult] =
    useState<KontrollListItem[]>(kontroller);

  function searchForKontroller(event: ChangeEvent<HTMLInputElement>): void {
    const searchTerm = event.target.value;
    const hits = search(searchTerm, (kontroll) => kontroll.tittel, kontroller);
    setSearchResult(hits);
  }

  return (
    <section className={classes.kontrollList}>
      <Heading level={1} size="xlarge">
        Alle kontroller
      </Heading>
      <Textfield
        className={classes.soek}
        label="Hvilken kontroll leter du etter?"
        onChange={searchForKontroller}
      />
      <div className={classes.filter}>
        {filters.map((s) => (
          <label key={s}>
            {sanitizeEnumLabel(s)}
            <input
              id={`filter-${s}`}
              type="radio"
              name="kontroller-filter"
              hidden
              value={s}
              defaultChecked={s === kontrollFilter}
              onChange={(event) =>
                setKontrollFilter(event.target.value as KontrollType)
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
          {searchResult
            .filter((k) => kontrollFilter === k.kontrolltype)
            .map((kontroll) => (
              <Table.Row key={kontroll.id}>
                <Table.Cell>
                  <Link
                    to={
                      kontrollFilter === 'forenkla-kontroll'
                        ? `/maaling?kontrollId=${kontroll.id}`
                        : `/kontroll/${kontroll.id}/oppsummering`
                    }
                  >
                    {kontroll.tittel}
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  {viewVirksomheter(kontroll.virksomheter)}
                </Table.Cell>
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

function viewVirksomheter(virksomheter: Orgnummer[]) {
  switch (virksomheter.length) {
    case 0:
      return '';
    case 1:
      return virksomheter[0];
    default:
      return `${virksomheter.length} virksomheter`;
  }
}
