import useAlert from '@common/alert/useAlert';
import { Alert, Heading, Paragraph } from '@digdir/designsystemet-react';
import { Loeysing } from '@loeysingar/api/types';
import classNames from 'classnames';
import { useState } from 'react';
import { useActionData, useLoaderData } from 'react-router-dom';

import classes from '../kontroll.module.css';
import LagreOgNeste from '../lagre-og-neste/LagreOgNeste';
import KontrollStepper from '../stepper/KontrollStepper';
import LoeysingFilter from './LoeysingFilter';
import { createDefaultSideutval } from './sideutval-util';
import SideutvalAccordion from './SideutvalAccordion';
import { SideutvalLoader, SideutvalLoeysing } from './types';

const Sideutval = () => {
  const { kontroll, innhaldstypeList, loeysingList } =
    useLoaderData() as SideutvalLoader;

  const [selectedLoeysing, setSelectedLoesying] = useState<
    Loeysing | undefined
  >();
  const [sideutvalLoeysing, setSideutvalLoeysing] = useState<
    SideutvalLoeysing | undefined
  >();
  const [alert, setAlert] = useAlert();
  const manueltSelected = true;
  const actionData = useActionData() as { sistLagret: Date };

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

  const lagreKontroll = () => console.log('lagre');

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
            {selectedLoeysing && (
              <SideutvalAccordion
                selectedLoeysing={selectedLoeysing}
                sideutvalLoeysing={sideutvalLoeysing}
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
                  onClickLagreKontroll={lagreKontroll}
                  onClickNeste={lagreKontroll}
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
