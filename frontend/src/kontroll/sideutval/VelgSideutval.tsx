import useAlert from '@common/alert/useAlert';
import { isDefined } from '@common/util/validationUtils';
import {
  Alert,
  ErrorSummary,
  Heading,
  Paragraph,
} from '@digdir/designsystemet-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loeysing } from '@loeysingar/api/types';
import { useState } from 'react';
import {
  FieldErrors,
  FormProvider,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { useActionData, useLoaderData, useSubmit } from 'react-router-dom';

import classes from '../kontroll.module.css';
import LagreOgNeste from '../lagre-og-neste/LagreOgNeste';
import KontrollStepper from '../stepper/KontrollStepper';
import { UpdateKontrollSideutval } from '../types';
import SideutvalAccordion from './accordion/SideutvalAccordion';
import LoeysingFilter from './LoeysingFilter';
import { getDefaultFormValues, getSideutvalTypeLabel } from './sideutval-util';
import { sideutvalValidationSchema } from './sideutvalValidationSchema';
import { FormError, SideutvalForm, SideutvalLoader } from './types';

const VelgSideutval = () => {
  const { kontroll, sideutvalTypeList, loeysingList } =
    useLoaderData() as SideutvalLoader;
  const actionData = useActionData() as { sistLagret: Date };
  const submit = useSubmit();
  const [formErrors, setFormErrors] = useState<FormError[]>([]);
  const [neste, setNeste] = useState<boolean>(false);

  const [selectedLoeysing, setSelectedLoesying] = useState<
    Loeysing | undefined
  >();

  const formMethods = useForm<SideutvalForm>({
    defaultValues: {
      sideutval: getDefaultFormValues(
        loeysingList,
        sideutvalTypeList,
        kontroll.sideutvalList
      ),
    },
    mode: 'onBlur',
    resolver: zodResolver(sideutvalValidationSchema),
  });

  const { register, control, handleSubmit } = formMethods;

  const onSubmitError = (errors: FieldErrors<SideutvalForm>) => {
    const errorList: FormError[] = [];
    const sideutvalErrors = errors.sideutval;
    // Index på errors er lik som index på field
    fields.forEach((field, index) => {
      if (sideutvalErrors && isDefined(sideutvalErrors[index])) {
        const sideutvalTypeLabel = getSideutvalTypeLabel(
          sideutvalTypeList,
          field.typeId,
          field.egendefinertType
        );

        errorList.push({
          loeysingId: field.loeysingId,
          sideutvalType: sideutvalTypeLabel,
        });
      }
    });
    setFormErrors(errorList);
  };

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

  const onSubmit = (form: SideutvalForm) => {
    alert?.clearMessage();
    setSelectedLoesying(undefined);
    setFormErrors([]);

    const data: UpdateKontrollSideutval = {
      kontroll,
      sideutvalList: form.sideutval,
      neste: neste,
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
        <button className={classes.selected}>Manuelt sideutval</button>
        <button disabled title="Automatisk sideutval kommer">
          Automatisk sideutval
        </button>
      </div>
      <LoeysingFilter
        heading={kontroll.tittel}
        loeysingList={loeysingList}
        sideutvalKontroll={kontroll.sideutvalList}
        onChangeLoeysing={handleChangeLoeysing}
        selectedLoeysing={selectedLoeysing}
      />
      {formErrors.length > 0 && (
        <div className={classes.sideutvalLoeysingErrors}>
          <ErrorSummary.Root size="medium">
            <ErrorSummary.Heading>
              Det er feil med sideutval på føljande løysingar
            </ErrorSummary.Heading>
            <ErrorSummary.List>
              {[
                ...new Set(formErrors.map((formError) => formError.loeysingId)),
              ].map((loeyingId) => (
                <ErrorSummary.Item
                  href={`#loeysing-${loeyingId}`}
                  key={loeyingId}
                >
                  {loeysingList.find((ll) => ll.id === loeyingId)?.namn}
                </ErrorSummary.Item>
              ))}
            </ErrorSummary.List>
          </ErrorSummary.Root>
        </div>
      )}
      <FormProvider {...formMethods}>
        <form
          className={classes.velgSideutvalContainer}
          onSubmit={handleSubmit(
            (data) => onSubmit(data),
            (errors) => onSubmitError(errors)
          )}
        >
          <div className={classes.centered}>
            <div className={classes.velgSideutval}>
              {selectedLoeysing && (
                <SideutvalAccordion
                  selectedLoeysing={selectedLoeysing}
                  sideutval={fields}
                  handleAddSide={handleAddSide}
                  handleRemoveSide={handleRemoveSide}
                  sideutvalTypeList={sideutvalTypeList}
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
                  <LagreOgNeste
                    sistLagret={actionData?.sistLagret}
                    feilet={formErrors.length > 0}
                    onClickNeste={() => setNeste(true)}
                    onClickLagreKontroll={() => setNeste(false)}
                    submitOnSave
                  />
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
