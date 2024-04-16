import { Alert, Heading, Paragraph } from '@digdir/designsystemet-react';
import classNames from 'classnames';
import { useState } from 'react';
import KontrollStepper from '../stepper/KontrollStepper';
import classes from '../kontroll.module.css';
import { SideutvalLoader, SideutvalLoeysing } from './types';
import useAlert from '@common/alert/useAlert';
import { useActionData, useLoaderData, useSubmit } from 'react-router-dom';
import LoeysingFilter from './LoeysingFilter';
import LagreOgNeste from '../lagre-og-neste/LagreOgNeste';

const Sideutval = () => {
  const { kontroll, innhaldsTypeList, loeysingList } =
    useLoaderData() as SideutvalLoader;
  const submit = useSubmit();

  const [selectedLoeysingId, setSelectedLoesyingId] = useState<number | undefined>();
  const [sideutvalLoeysing, setSideutvalLoeysing] = useState<SideutvalLoeysing | undefined>();
  const [sideutval, setSideutval] = useState<SideutvalLoeysing[]>([]);
  const [alert, setAlert] = useAlert();
  const manueltSelected = true;
  const actionData = useActionData() as { sistLagret: Date };

  const handleChangeLoeysing = (loeysingId: number) => {
    setSelectedLoesyingId(loeysingId);
    setSideutvalLoeysing(sideutval.find(su => su.loesyingId === loeysingId));
  }

  const lagreKontroll = () => console.log("lagre");


  return (
    <section className={classes.kontrollSection}>
      <KontrollStepper />
      <Heading level={1} size="large">
        Sideutval
      </Heading>
      <Paragraph>
        Vel hvilke sider du vil ha med inn i testen
      </Paragraph>
      <div className={classes.automatiskEllerManuelt}>
        <button
          className={classNames({
            [classes.selected]: manueltSelected,
          })}
        >
          Vel testregelsett
        </button>
        <button
          className={classNames({
            [classes.selected]: !manueltSelected,
          })}
        >
          Vel testreglar selv
        </button>
      </div>
      <div className={classes.testreglarValgWrapper}>
        <LoeysingFilter
          heading={kontroll.tittel}
          loeysingList={loeysingList}
          onChangeLoeysing={handleChangeLoeysing}
          selectedLoeysingId={selectedLoeysingId}
        />
        <div className={classes.testreglarValg}>

        </div>
        {alert && <Alert severity={alert.severity}>{alert.message}</Alert>}
        <LagreOgNeste
          sistLagret={actionData?.sistLagret}
          onClickLagreKontroll={lagreKontroll}
          onClickNeste={lagreKontroll}
        />
      </div>
    </section>
  );
}

export default Sideutval;