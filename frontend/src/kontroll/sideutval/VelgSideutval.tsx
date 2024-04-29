import useAlert from '@common/alert/useAlert';
import { Alert, Button, Heading, Paragraph, } from '@digdir/designsystemet-react';
import { Loeysing } from '@loeysingar/api/types';
import { useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useLoaderData } from 'react-router-dom';

import classes from '../kontroll.module.css';
import KontrollStepper from '../stepper/KontrollStepper';
import SideutvalAccordion from './accordion/SideutvalAccordion';
import LoeysingFilter from './LoeysingFilter';
import { getDefaultFormValues } from './sideutval-util';
import { SideutvalForm, SideutvalLoader } from './types';

const VelgSideutval = () => {
  const { kontroll, innhaldstypeList, loeysingList } =
    useLoaderData() as SideutvalLoader;

  const [selectedLoeysing, setSelectedLoesying] = useState<
    Loeysing | undefined
  >();

  const formMethods = useForm<SideutvalForm>({
    defaultValues: {
      sideutval:
        kontroll?.sideutval ??
        getDefaultFormValues(loeysingList, innhaldstypeList),
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = formMethods;

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
      loeysingId: loeysingId,
      typeId: typeId,
      begrunnelse: '',
      url: '',
      egendefinertType: egendefinertType,
    });
  };

  const handleRemoveSide = (indices: number[]) => {
    remove(indices);
  };

  const onSubmit = (data: SideutvalForm) => {
    console.log('SUBMIT');
    console.log(data);
  };

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

  return (
    <section className={classes.sideutvalSection}>
      <KontrollStepper />
      <Heading level={1} size="large">
        Sideutval
      </Heading>
      <Paragraph>Vel hvilke sider du vil ha med inn i testen</Paragraph>
      <div className={classes.automatiskEllerManuelt}>
        <button className={classes.selected}>Manuelt sideutval</button>
        <button>Automatisk sideutval</button>
      </div>
      <LoeysingFilter
        heading={kontroll.tittel}
        loeysingList={loeysingList}
        onChangeLoeysing={handleChangeLoeysing}
        selectedLoeysing={selectedLoeysing}
      />
      <FormProvider {...formMethods}>
        <form
          className={classes.velgSideutvalContainer}
          onSubmit={handleSubmit((data) => console.log(data))}
        >
          <div className={classes.centered}>
            <div className={classes.velgSideutval}>
              {selectedLoeysing && (
                <SideutvalAccordion
                  selectedLoeysing={selectedLoeysing}
                  sideutval={fields}
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
                  <br />
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
      </FormProvider>
    </section>
  );
};

export default VelgSideutval;
