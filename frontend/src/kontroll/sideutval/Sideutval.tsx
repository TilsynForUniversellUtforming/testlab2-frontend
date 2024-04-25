import useAlert from '@common/alert/useAlert';
import { Alert, Heading, Paragraph } from '@digdir/designsystemet-react';
import { Loeysing } from '@loeysingar/api/types';
import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { useActionData, useLoaderData, useSubmit } from 'react-router-dom';

import classes from '../kontroll.module.css';
import LagreOgNeste from '../lagre-og-neste/LagreOgNeste';
import KontrollStepper from '../stepper/KontrollStepper';
import LoeysingFilter from './LoeysingFilter';
import { createDefaultSideutval } from './sideutval-util';
import SideutvalAccordion from './SideutvalAccordion';
import { SideutvalLoader, SideutvalLoeysing } from './types';
import { UpdateKontrollSideutval } from '../types';

const Sideutval = () => {
  const { kontroll, innhaldstypeList, loeysingList } =
    useLoaderData() as SideutvalLoader;

  const submit = useSubmit();

  const [selectedLoeysing, setSelectedLoesying] = useState<
    Loeysing | undefined
  >();
  const [sideutvalLoeysing, setSideutvalLoeysing] = useState<
    SideutvalLoeysing | undefined
  >();
  const [alert, setAlert] = useAlert();
  const manueltSelected = true;
  const actionData = useActionData() as { sistLagret: Date };
  const handleSetSideutvalLoeysing = useCallback(
    (sideutvalLoeysing: SideutvalLoeysing) => {
      setSideutvalLoeysing(sideutvalLoeysing);
    },
    [sideutvalLoeysing]
  );

  const handleChangeLoeysing = (loeysingId: number) => {
    const loeysing = loeysingList.find((l) => l.id === loeysingId);
    if (!loeysing) {
      setAlert('danger', 'Ugylig løysing valgt');
      return;
    }

    setSelectedLoesying((prev) =>
      loeysing.id === prev?.id ? undefined : loeysing
    );
    const sideutvalLoeysing = kontroll?.sideutval?.find(
      (su) => su.loeysingId === loeysingId
    );
    if (sideutvalLoeysing) {
      setSideutvalLoeysing(sideutvalLoeysing);
    } else {
      const forsideType = innhaldstypeList.find(
        (it) => it.innhaldstype.toLowerCase() === 'forside'
      );
      if (!forsideType) {
        setAlert('danger', 'Utval for forside finnes ikkje i systemet');
        return;
      }
      setSideutvalLoeysing(createDefaultSideutval(loeysingId, forsideType));
    }
  };

  const lagreKontroll = (neste: boolean) => {
    alert?.clearMessage();

    if (!sideutvalLoeysing) {
      setAlert('danger', 'Må velja sideutval');
      return;
    }

    const data: UpdateKontrollSideutval = {
      kontroll: kontroll,
      sideutval: sideutvalLoeysing,
      neste,
    };
    submit(JSON.stringify(data), {
      method: 'put',
      action: `/kontroll/${kontroll.id}/sideutval`,
      encType: 'application/json',
    });
  };


  return (
    <section className={classes.sideutvalSection}>
      <KontrollStepper />
      <Heading level={1} size="large">
        Sideutval
      </Heading>
      <Paragraph>Vel hvilke sider du vil ha med inn i testen</Paragraph>
      <div className={classes.automatiskEllerManuelt}>
        <button
          className={classNames({
            [classes.selected]: manueltSelected,
          })}
        >
          Manuelt sideutval
        </button>
        <button
          className={classNames({
            [classes.selected]: !manueltSelected,
          })}
        >
          Automatisk sideutval
        </button>
      </div>
      <LoeysingFilter
        heading={kontroll.tittel}
        loeysingList={loeysingList}
        onChangeLoeysing={handleChangeLoeysing}
        selectedLoeysing={selectedLoeysing}
      />
      <div className={classes.velgSideutvalContainer}>
        <div className={classes.centered}>
          <div className={classes.velgSideutval}>
            {selectedLoeysing && sideutvalLoeysing && (
              <SideutvalAccordion
                selectedLoeysing={selectedLoeysing}
                sideutvalLoeysing={sideutvalLoeysing}
                setSideutvalLoesying={handleSetSideutvalLoeysing}
                innhaldstypeList={innhaldstypeList}
              />
            )}
            <div className={classes.centered}>
              <div className={classes.sideutvalForm}>
                {alert && (
                  <Alert severity={alert.severity}>{alert.message}</Alert>
                )}
                <LagreOgNeste
                  sistLagret={actionData?.sistLagret}
                  onClickLagreKontroll={() => lagreKontroll(false)}
                  onClickNeste={() => lagreKontroll(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sideutval;
