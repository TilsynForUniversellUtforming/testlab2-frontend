import useAlert from '@common/alert/useAlert';
import { Alert, ErrorSummary, Heading, Paragraph } from '@digdir/designsystemet-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loeysing } from '@loeysingar/api/types';
import { useEffect, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useActionData, useLoaderData, useSubmit } from 'react-router-dom';

import classes from '../kontroll.module.css';
import KontrollStepper from '../stepper/KontrollStepper';
import SideutvalAccordion from './accordion/SideutvalAccordion';
import LoeysingFilter from './LoeysingFilter';
import { getDefaultFormValues, getTestobjektLabel } from './sideutval-util';
import { sideutvalValidationSchema } from './sideutvalValidationSchema';
import { FormError, SideutvalForm, SideutvalLoader } from './types';
import { isDefined } from '@common/util/validationUtils';
import { sanitizeEnumLabel } from '@common/util/stringutils';

const VelgSideutval = () => {
  const { kontroll, testobjektList, loeysingList } =
    useLoaderData() as SideutvalLoader;
  const actionData = useActionData() as { sistLagret: Date };
  const submit = useSubmit();
  const [formErrors, setFormErrors] = useState<FormError[]>([]);

  const [selectedLoeysing, setSelectedLoesying] = useState<
    Loeysing | undefined
  >();

  const formMethods = useForm<SideutvalForm>({
    defaultValues: {
      sideutval:
        kontroll?.sideutval ??
        getDefaultFormValues(loeysingList, testobjektList),
    },
    mode: 'onBlur',
    resolver: zodResolver(sideutvalValidationSchema),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = formMethods;

  useEffect(() => {
    const errorList: FormError[] = [];
    const sideutvalErrors = errors.sideutval;
    // Index på errors er lik som index på field
    fields.forEach((field, index) => {
      if (sideutvalErrors && isDefined(sideutvalErrors[index])) {
        const testobjekt = getTestobjektLabel(testobjektList, field.objektId, field.egendefinertObjekt)

        errorList.push({ loeysingId: field.loeysingId, testobjekt: sanitizeEnumLabel(testobjekt) })
      }
    });

    setFormErrors(errorList);

  }, [errors]);

  const { fields, append, remove } = useFieldArray({
    name: 'sideutval',
    control,
  });

  const [alert, setAlert] = useAlert();

  const handleAddSide = (
    loeysingId: number,
    objektId: number,
    egendefinertObjekt?: string
  ) => {
    append({
      loeysingId: loeysingId,
      objektId: objektId,
      begrunnelse: '',
      url: '',
      egendefinertObjekt: egendefinertObjekt,
    });
  };

  const handleRemoveSide = (indices: number[]) => {
    remove(indices);
  };

  const onSubmit = (data: SideutvalForm) => {
    console.log('submitter')
    submit(JSON.stringify(data), {
      method: 'put',
      action: `/kontroll/${kontroll.id}/sideutval`,
      encType: 'application/json',
    });
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
      {formErrors.length > 0 &&
        <div className={classes.sideutvalLoeysingErrors}>
          <ErrorSummary.Root size="medium" >
            <ErrorSummary.Heading>
              Det er feil med sideutval på føljande løysingar
            </ErrorSummary.Heading>
            <ErrorSummary.List>
              {[...new Set(formErrors.map((formError) => formError.loeysingId))].map((loeyingId) =>
                <ErrorSummary.Item href={`#loeysing-${loeyingId}`} key={loeyingId}>
                  {loeysingList.find(ll => ll.id === loeyingId)?.namn}
                </ErrorSummary.Item>
              )}
            </ErrorSummary.List>
          </ErrorSummary.Root>
        </div>
      }
      <FormProvider {...formMethods}>
        <form
          className={classes.velgSideutvalContainer}
          onSubmit={handleSubmit((data) => onSubmit(data))}
        >
          <div className={classes.centered}>
            <div className={classes.velgSideutval}>
              {selectedLoeysing && (
                <SideutvalAccordion
                  selectedLoeysing={selectedLoeysing}
                  sideutval={fields}
                  handleAddSide={handleAddSide}
                  handleRemoveSide={handleRemoveSide}
                  testobjektList={testobjektList}
                  formErrors={formErrors}
                  register={register}
                />
              )}
              <div className={classes.centered}>
                <div className={classes.sideutvalForm}>
                  {alert && (
                    <Alert severity={alert.severity}>{alert.message}</Alert>
                  )}
                  <br />
                  <input type="submit" />
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
