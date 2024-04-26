import useAlert from '@common/alert/useAlert';
import { Alert, Heading, Paragraph } from '@digdir/designsystemet-react';
import { Loeysing } from '@loeysingar/api/types';
import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { useActionData, useLoaderData, useSubmit } from 'react-router-dom';

import classes from '../kontroll.module.css';
import LagreOgNeste from '../lagre-og-neste/LagreOgNeste';
import KontrollStepper from '../stepper/KontrollStepper';
import { UpdateKontrollSideutval } from '../types';
import SideutvalAccordion from './accordion/SideutvalAccordion';
import LoeysingFilter from './LoeysingFilter';
import { createDefaultSideutval } from './sideutval-util';
import { Sideutval, SideutvalLoader } from './types';

const VelgSideutval = () => {
  const { kontroll, innhaldstypeList, loeysingList } =
    useLoaderData() as SideutvalLoader;

  const submit = useSubmit();

  const [selectedLoeysing, setSelectedLoesying] = useState<
    Loeysing | undefined
  >();
  const [sideutval, setSideutval] = useState<Sideutval[]>([]);

  const [alert, setAlert] = useAlert();
  const manueltSelected = true;
  const actionData = useActionData() as { sistLagret: Date };

  const handleAddSideutval = useCallback(
    (sideutval: Sideutval) => {
      setSideutval((prev) => [...prev, sideutval]);
    },
    [sideutval]
  );

  const handleRemoveInnhaldstype = useCallback(
    (typeId: number, egendefinertType?: string) => {
      const forside = innhaldstypeList.find(
        (it) => it.innhaldstype.toLowerCase() === 'forside'
      );
      if (!forside) {
        throw Error('Forside finns ikkje');
      }

      if (typeId === forside.id) {
        setAlert('danger', 'Kan ikkje ta bort forside');
      }

      if (egendefinertType) {
        setSideutval((prev) =>
          prev.filter((su) => su.egendefinertType !== egendefinertType)
        );
      } else {
        setSideutval((prev) => prev.filter((su) => su.typeId !== typeId));
      }
    },
    [sideutval]
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
    const sideutvalLoeysing = kontroll?.sideutval?.filter(
      (su) => su.loeysingId === loeysingId
    );
    if (sideutvalLoeysing && sideutvalLoeysing.length > 0) {
      setSideutval(sideutvalLoeysing);
    } else {
      const forsideType = innhaldstypeList.find(
        (it) => it.innhaldstype.toLowerCase() === 'forside'
      );
      if (!forsideType?.id) {
        setAlert('danger', 'Utval for forside finnes ikkje i systemet');
        return;
      }
      setSideutval(createDefaultSideutval(loeysingId, forsideType.id));
    }
  };

  const lagreKontroll = (neste: boolean) => {
    alert?.clearMessage();

    if (sideutval.length === 0) {
      setAlert('danger', 'Må velja sideutval');
      return;
    }

    const data: UpdateKontrollSideutval = {
      kontroll: kontroll,
      sideutval: sideutval,
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
            {selectedLoeysing && sideutval && (
              <SideutvalAccordion
                selectedLoeysing={selectedLoeysing}
                sideutval={sideutval}
                handleAddSideutval={handleAddSideutval}
                handleRemoveInnhaldstype={handleRemoveInnhaldstype}
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

export default VelgSideutval;
