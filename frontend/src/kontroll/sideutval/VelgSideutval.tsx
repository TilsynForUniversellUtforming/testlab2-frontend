import useAlert from '@common/alert/useAlert';
import { Alert, Button, Heading, Paragraph, } from '@digdir/designsystemet-react';
import { Loeysing } from '@loeysingar/api/types';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useLoaderData } from 'react-router-dom';

import classes from '../kontroll.module.css';
import KontrollStepper from '../stepper/KontrollStepper';
import SideutvalAccordion from './accordion/SideutvalAccordion';
import LoeysingFilter from './LoeysingFilter';
import { getDefaultFormValues, groupByType } from './sideutval-util';
import { SideutvalForm, SideutvalIndexed, SideutvalLoader } from './types';

const VelgSideutval = () => {
  const { kontroll, innhaldstypeList, loeysingList } =
    useLoaderData() as SideutvalLoader;

  const [selectedLoeysing, setSelectedLoesying] = useState<
    Loeysing | undefined
  >();
  const [sideutvalByInnhaldstype, setSideutvalByInnhaldstype] = useState<Map<string, SideutvalIndexed[]>>(new Map());

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SideutvalForm>({
    defaultValues: {
      sideutval:
        kontroll?.sideutval ??
        getDefaultFormValues(loeysingList, innhaldstypeList),
    },
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({
    name: 'sideutval',
    control,
  });

  const [alert, setAlert] = useAlert();

  const handleAddSide = (
    loeysingId: number,
    typeId: number,
    egendefinertType?: string
  ) => {
    append({
      loeysingId: Number(loeysingId),
      typeId: Number(typeId),
      egendefinertType: egendefinertType,
      url: '',
      begrunnelse: '',
    });
  };

  const handleRemoveSide = (indices: number[]) => {
    remove(indices);
  };

  const onSubmit = (data: SideutvalForm) => console.log(data);

  const manueltSelected = true;

  const handleChangeLoeysing = (loeysingId: number) => {
    const loeysing = loeysingList.find((l) => l.id === loeysingId);
    if (!loeysing) {
      setAlert('danger', 'Ugylig løysing valgt');
      return;
    }

    setSelectedLoesying((prev) =>
      loeysing.id === prev?.id ? undefined : loeysing
    );
  };

  useEffect(() => {
    setSideutvalByInnhaldstype(groupByType(fields, innhaldstypeList));
  }, [fields]);

  console.log(fields)

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
      <form
        className={classes.velgSideutvalContainer}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={classes.centered}>
          <div className={classes.velgSideutval}>
            {selectedLoeysing && (
              <SideutvalAccordion
                selectedLoeysing={selectedLoeysing}
                sideutvalByInnhaldstype={sideutvalByInnhaldstype}
                handleAddSide={handleAddSide}
                handleRemoveSide={handleRemoveSide}
                innhaldstypeList={innhaldstypeList}
                register={register}
              />
            )}
            <div className={classes.centered}>
              <div className={classes.sideutvalForm}>
                {alert && (
                  <Alert severity={alert.severity}>{alert.message}</Alert>
                )}
                <br/>
                <Button type="submit" className={classes.opprettResten}>
                  Opprett resten av kontrollen
                </Button>
                {/*<LagreOgNeste*/}
                {/*  sistLagret={actionData?.sistLagret}*/}
                {/*  onClickLagreKontroll={() => lagreKontroll(false)}*/}
                {/*  onClickNeste={() => lagreKontroll(true)}*/}
                {/*/>*/}
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default VelgSideutval;
