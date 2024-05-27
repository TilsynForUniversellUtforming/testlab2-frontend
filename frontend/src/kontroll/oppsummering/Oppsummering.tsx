import { sanitizeEnumLabel } from '@common/util/stringutils';
import { isDefined } from '@common/util/validationUtils';
import {
  Alert,
  Button,
  Heading,
  Ingress,
  Pagination,
  Paragraph,
  Tag,
} from '@digdir/designsystemet-react';
import { Loeysing, Utval } from '@loeysingar/api/types';
import { CheckmarkCircleIcon, CircleSlashIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';

import kontrollClasses from '../kontroll.module.css';
import { Kontroll, steps } from '../types';
import classes from './oppsummering.module.css';

export function Oppsummering() {
  const kontroll = useLoaderData() as Kontroll;
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const elementsPerPage = 7;
  const totalPages = Math.ceil(
    (kontroll.utval?.loeysingar?.length ?? 0) / elementsPerPage
  );

  function listeElement(loeysing: Loeysing) {
    const nettsteder = kontroll.sideutvalList.filter(
      (sideutval) => sideutval.loeysingId === loeysing.id
    ).length;
    const mobilapper: number = 0;

    function chooseIcon(antall: number) {
      if (antall > 0) {
        return <CheckmarkCircleIcon fontSize={24} />;
      } else {
        return <CircleSlashIcon fontSize={24} />;
      }
    }

    return (
      <li className={classes.listeelement} key={loeysing.id}>
        <Heading level={3} size="small" className={classes.navn}>
          {loeysing.namn}
        </Heading>
        <div className={classes.nettstederOgMobilapper}>
          <div className={classes.nettsteder}>
            {chooseIcon(nettsteder)}
            {nettsteder} {nettsteder === 1 ? 'nettsted' : 'nettsteder'}
          </div>
          <div className={classes.mobilapper}>
            {chooseIcon(mobilapper)}
            {mobilapper} {mobilapper === 1 ? 'mobilapp' : 'mobilapper'}
          </div>
        </div>
      </li>
    );
  }

  function viewUtvalNamn(utval: Utval | undefined) {
    if (utval?.namn) {
      return utval.namn;
    } else {
      console.error('Utval mangler på denne kontrollen');
      return 'Utval mangler';
    }
  }

  function getPage(
    loeysingar: Loeysing[] | undefined,
    currentPage: number
  ): Loeysing[] {
    if (!loeysingar || loeysingar.length === 0) {
      return [];
    }

    const start = (currentPage - 1) * elementsPerPage;
    const end = start + elementsPerPage;
    return loeysingar.slice(start, end);
  }

  function lagreOgLukk() {
    navigate('/');
  }

  const loeysingIdList = kontroll.utval?.loeysingar?.map((l) => l.id) ?? [];
  const sideutvalLoeysingIdList = kontroll.sideutvalList.map(
    (su) => su.loeysingId
  );

  const isForenkla = kontroll.kontrolltype === 'forenkla-kontroll';

  const isFinished =
    loeysingIdList.length > 0 &&
    isDefined(kontroll.testreglar?.testregelList) &&
    (isForenkla ||
      loeysingIdList.every((loeysingId) =>
        sideutvalLoeysingIdList.includes(loeysingId)
      ));

  return (
    <section className={kontrollClasses.kontrollSection}>
      <Heading level={1} size="xlarge" className={classes.hovedoverskrift}>
        Kontrollen er opprettet
      </Heading>

      <Alert severity="info" className={classes.infoboks}>
        <Heading level={2} size="xsmall">
          Du er ferdig med å opprette kontrollen.
        </Heading>
        <Paragraph spacing>
          Virksomheter, løsninger og testregler er på plass. Dersom du ønsker å
          redigere disse, kan du gjøre det på et senere tidspunkt, eller gå
          tilbake og redigere med en gang.{' '}
        </Paragraph>
        <Paragraph spacing>
          Vil du opprette flere kontroller, eller er ferdig for nå, velger du
          lagre og lukk. Da kommer du tilbake til startsiden.
        </Paragraph>
        <Paragraph spacing>
          Vil du gjennomføre testen, velg hvem du vil starte med fra listen
          under.{' '}
        </Paragraph>
      </Alert>

      <Button
        variant="secondary"
        onClick={lagreOgLukk}
        className={classes.lagreOgLukk}
      >
        Lagre og lukk
      </Button>

      <div className={classes.kontrollTittel}>
        <Ingress>{kontroll.tittel}</Ingress>
        <div className={classes.tags}>
          <Tag color="first">{sanitizeEnumLabel(kontroll.kontrolltype)}</Tag>
          <Tag color="first">{kontroll.saksbehandler}</Tag>
        </div>
      </div>

      <div className={classes.loesninger}>
        <Heading level={2} size="large">
          Velg hvilken løsning du vil starte kontrollen for
        </Heading>
        <div className={classes.tags}>
          <Tag color="first">{viewUtvalNamn(kontroll.utval)}</Tag>
        </div>
        <ul className={classes.liste}>
          {getPage(kontroll.utval?.loeysingar, currentPage).map(listeElement)}
        </ul>
        {totalPages > 1 && (
          <Pagination
            className={classes.pagination}
            nextLabel="Neste"
            previousLabel="Forrige"
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={setCurrentPage}
          />
        )}
      </div>
      <div className={classes.tilbakeOgNeste}>
        <Button
          variant="secondary"
          onClick={() =>
            navigate(`../${kontroll.id}/${steps.sideutval.relativePath}`)
          }
        >
          Tilbake
        </Button>
        {isFinished && (
          <Link
            to={
              isForenkla
                ? `../../maaling?kontrollId=${kontroll.id}`
                : `../../kontroll-test/${kontroll.id}`
            }
          >
            <Button>Gå til test</Button>
          </Link>
        )}
      </div>
    </section>
  );
}
