import { drop, isEmpty, take } from '@common/util/arrayUtils';
import { formatDate } from '@common/util/stringutils';
import {
  Alert,
  Button,
  Dialog,
  Heading,
  Paragraph,
} from '@digdir/designsystemet-react';
import { Utval } from '@loeysingar/api/types';
import classNames from 'classnames';
import React from 'react';
import { useActionData, useLoaderData, useSubmit } from 'react-router';

import classes from '../kontroll.module.css';
import LagreOgNeste from '../lagre-og-neste/LagreOgNeste';
import KontrollStepper from '../stepper/KontrollStepper';
import { Kontroll } from '../types';
import { InformationIcon, InformationSquareIcon } from '@navikt/aksel-icons';
import { UtvalDetailButton } from './UtvalDetailButton';



type SelectedUtvalg = { t: 'utvalg'; valgtUtvalg?: Utval };
type SelectedOption = SelectedUtvalg | { t: 'løsning' };

const VelgLoesninger = () => {
  const { kontroll, utval } = useLoaderData() as {
    kontroll: Kontroll;
    utval: Utval[];
  };
  const actionData = useActionData() as { sistLagret: Date };
  const [selectedOption, setSelectedOption] = React.useState<
    SelectedOption | undefined
  >(() => {
    if (kontroll?.utval) {
      return { t: 'utvalg', valgtUtvalg: kontroll.utval };
    }
  });
  const submit = useSubmit();

  const utvalSortedByOppretta = utval.toSorted(
    (a, b) => b.oppretta.getTime() - a.oppretta.getTime()
  );
  const nyesteUtvalg = take(utvalSortedByOppretta, 6);
  const eldreUtvalg = drop(utvalSortedByOppretta, 6);

  function velgUtvalg(utval: Utval) {
    return function () {
      setSelectedOption({ t: 'utvalg', valgtUtvalg: utval });
    };
  }

  function isUtvalg(
    selectedOption: SelectedOption | undefined
  ): selectedOption is SelectedUtvalg {
    return selectedOption?.t === 'utvalg';
  }

  function isLoesning(
    selectedOption: SelectedOption | undefined
  ): selectedOption is { t: 'løsning' } {
    return selectedOption?.t === 'løsning';
  }

  function isValgt(utval: Utval) {
    return (
      isUtvalg(selectedOption) && selectedOption?.valgtUtvalg?.id === utval.id
    );
  }

  function lagre(gaaTilNeste: boolean): () => void {
    return () => {
      if (isUtvalg(selectedOption) && selectedOption.valgtUtvalg) {
        const data = {
          kontroll,
          utval: selectedOption.valgtUtvalg,
          neste: gaaTilNeste,
        };
        submit(JSON.stringify(data), {
          method: 'put',
          action: `/kontroll/${kontroll.id}/velg-losninger`,
          encType: 'application/json',
        });
      }
    };
  }

  return (
    <section className={classes.kontrollSection}>
      <KontrollStepper />
      <div className={classes.velgLoesningerOverskrift}>
        <Heading level={1} data-size="xl">
          Vel løysingar
        </Heading>
        <Paragraph>Vel kva løysingar du vil ha med i kontrollen</Paragraph>
      </div>
      <div className={classes.utvalgEllerManuelt}>
        <button
          type={'button'}
          onClick={() =>
            setSelectedOption({ t: 'utvalg', valgtUtvalg: kontroll?.utval })
          }
          className={classNames({
            [classes.selected]: isUtvalg(selectedOption),
          })}
        >
          Vel løysingar frå utval
        </button>
        <button
          type={'button'}
          onClick={() => setSelectedOption({ t: 'løsning' })}
          className={classNames({
            [classes.selected]: selectedOption?.t === 'løsning',
          })}
        >
          Vel løysingar sjølv
        </button>
      </div>
      {isUtvalg(selectedOption) && (
        <>
          <Heading level={2} data-size="lg">
            Nyaste utval av løysingar
          </Heading>
          <ul className={classes.nyesteUtvalgButtons}>
            {nyesteUtvalg.map((u) => (
         <UtvalDetailButton key={u.id} utval={u} velgUtval={velgUtvalg} isValgt={isValgt} />
            ))}
          </ul>
          {!isEmpty(eldreUtvalg) && (
            <>
              <Heading level={2} data-size="lg">
                Eldre utval av løysingar
              </Heading>
              <ul className={classes.eldreUtvalg}>
                {eldreUtvalg.map((u) => {
                  const valgt = isValgt(u);
                  return (
                    <li
                      key={u.id}
                      className={classNames(classes.eldreUtvalgPreviewWrapper, {
                        [classes.selected]: valgt,
                      })}
                    >
                      <button
                        type={'button'}
                        onClick={velgUtvalg(u)}
                        className={classNames(classes.eldreUtvalgValgButton, {
                          [classes.selected]: valgt,
                        })}
                        title={u.namn}
                      >
                        {u.namn}
                      </button>
                      <Button
                        className={classes.utvalgPreviewTrigger}
                        command="show-modal"
                        commandfor={`utval-preview-modal-${u.id}`}
                        data-utvalid={u.id}
                        data-variant={'secondary'}
                        icon
                      >
                        <InformationIcon title="a11y-title" fontSize="1.5rem" />
                      </Button>
                      <Dialog id={`utval-preview-modal-${u.id}`}>
                        <Heading style={{ marginBottom: 'var(--ds-size-2)' }}>
                          Dialog header
                        </Heading>
                        <Paragraph style={{ marginBottom: 'var(--ds-size-2)' }}>
                          <ul>
                            {u.loeysingar.map((loeysing) => {
                              return <li key={loeysing.id}>{loeysing.namn}</li>;
                            })}
                          </ul>
                        </Paragraph>
                      </Dialog>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
          <LagreOgNeste
            sistLagret={actionData?.sistLagret}
            onClickLagreKontroll={lagre(false)}
            onClickNeste={lagre(true)}
          />
        </>
      )}
      {isLoesning(selectedOption) && (
        <Alert data-color="warning">
          Manuelt val av løysingar er ikke ferdig enda.
        </Alert>
      )}
    </section>
  );
};

export default VelgLoesninger;
