import useAlert from '@common/alert/useAlert';
import { ButtonSize, ButtonVariant } from '@common/types';
import { Accordion, Alert, Button, Chip, Combobox, Heading, Paragraph, Textfield, } from '@digdir/designsystemet-react';
import { Loeysing } from '@loeysingar/api/types';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { FieldArrayWithId, useFormContext, UseFormRegister } from 'react-hook-form';

import classes from '../../kontroll.module.css';
import SideBegrunnelseForm from '../form/SideBegrunnelseForm';
import { groupByType, toSelectableTestobjekt } from '../sideutval-util';
import { FormError, SideutvalForm, TestobjektKontroll } from '../types';

interface Props {
  selectedLoeysing: Loeysing;
  sideutval: FieldArrayWithId<SideutvalForm, 'sideutval', 'id'>[];
  handleAddSide: (
    loeysingId: number,
    objektId: number,
    egendefinertObjekt?: string
  ) => void;
  formErrors: FormError[];
  handleRemoveSide: (indices: number[]) => void;
  testobjektList: TestobjektKontroll[];
  register: UseFormRegister<SideutvalForm>;
}

const SideutvalAccordion = ({
  sideutval,
  handleAddSide,
  handleRemoveSide,
  formErrors,
  testobjektList,
  selectedLoeysing,
  register,
}: Props) => {
  const [selectableTestobjekt, setSelectableTestobjekt] = useState<
    TestobjektKontroll[]
  >(toSelectableTestobjekt(testobjektList, sideutval, selectedLoeysing.id));
  const [testobjektToAdd, setTestobjektToAdd] = useState<
    TestobjektKontroll | undefined
  >();
  const [egendefinertObjekt, setEgendefinertObjekt] = useState<string>('');
  const [expanded, setExpanded] = useState<string[]>([]);
  const [alert, setAlert] = useAlert();
  const { formState: { errors } } = useFormContext<SideutvalForm>();

  const handleSetExpanded = (key: string) => {
    setExpanded((prevExpanded) =>
      prevExpanded.includes(key)
        ? prevExpanded.filter((p) => p !== key)
        : [...prevExpanded, key]
    );
  };

  const onChangeTestobjekt = (values: string[]) => {
    const testobjektId = parseInt(values[0]);
    const testobjekt = selectableTestobjekt.find(
      (type) => type.id === testobjektId
    );
    setTestobjektToAdd(testobjekt);
  };

  const handleAddTestobjekt = () => {
    if (!testobjektToAdd) {
      setAlert('danger', 'Ugylding testobjekt');
      return;
    }

    if (
      testobjektToAdd &&
      testobjektToAdd.testobjekt.toLowerCase() === 'egendefinert' &&
      !egendefinertObjekt
    ) {
      setAlert('danger', 'Ugylding testobjekt');
      return;
    }

    // Hvis man legger til en ny testobjekt som ikke er egendefinert, ta bort denne fra dropdown
    if (!egendefinertObjekt) {
      setSelectableTestobjekt((prev) =>
        prev.filter((it) => it.id !== testobjektToAdd.id)
      );
    }

    if (testobjektToAdd) {
      handleAddSide(
        selectedLoeysing.id,
        testobjektToAdd.id,
        egendefinertObjekt
      );
      setTestobjektToAdd(undefined);
      setEgendefinertObjekt('');
    }
  };

  useEffect(() => {
    // Lukk alle accordion items det ikke er feil på ved endring av løysing
    setExpanded(formErrors.filter(fe => fe.loeysingId === selectedLoeysing.id).map(fe => fe.testobjekt));
    setSelectableTestobjekt(
      toSelectableTestobjekt(testobjektList, sideutval, selectedLoeysing.id)
    );
  }, [selectedLoeysing]);

  useEffect(() => {
    setSelectableTestobjekt(
      toSelectableTestobjekt(testobjektList, sideutval, selectedLoeysing.id)
    );
  }, [sideutval]);

  useEffect(() => {
    // Åpne alle accordion items det er feil på
    setExpanded(formErrors.filter(fe => fe.loeysingId === selectedLoeysing.id).map(fe => fe.testobjekt));
  }, [formErrors]);

  return (
    <div className={classes.accordion}>
      <div className={classes.centered}>
        <div
          className={classNames(
            classes.sideutvalForm,
            classes.testregelTypeSelector
          )}
        >
          <Heading level={5} size="small">
            {selectedLoeysing.namn}
          </Heading>
          <Chip.Group className={classes.chipSpacing}>
            <Chip.Toggle selected checkmark>
              Test av nettside
            </Chip.Toggle>
            <Chip.Toggle disabled>Test av mobil</Chip.Toggle>
          </Chip.Group>
          <Paragraph size="medium">
            Velg i nedtrekkslisten. Forside skal alltid med. 10% av utvalget
            skal være egendefinert. Velg derfor egendefinert for disse sidene.
          </Paragraph>
        </div>
      </div>
      <div className={classes.centered}>
        <div className={classes.sideutvalForm}>
          <div className={classes.testobjektSelect}>
            <Combobox
              label="Legg til testobjekt"
              size="small"
              value={
                testobjektToAdd?.id ? [String(testobjektToAdd.id)] : []
              }
              onValueChange={onChangeTestobjekt}
              inputValue={
                testobjektToAdd?.testobjekt
                  ? String(testobjektToAdd.testobjekt)
                  : ''
              }
            >
              <Combobox.Empty>Ingen treff</Combobox.Empty>
              {selectableTestobjekt.map((tl) => (
                <Combobox.Option value={String(tl.id)} key={tl.id}>
                  {tl.testobjekt}
                </Combobox.Option>
              ))}
            </Combobox>
            {testobjektToAdd?.testobjekt?.toLowerCase() ===
              'egendefinert' && (
              <Textfield
                label="Egendefinert testobjekt"
                value={
                  egendefinertObjekt?.length !== 0 ? egendefinertObjekt : undefined
                }
                onChange={(e) => setEgendefinertObjekt(e.target.value)}
              />
            )}
            <Button
              className={classes.testobjektLagre}
              variant={ButtonVariant.Outline}
              size={ButtonSize.Small}
              onClick={handleAddTestobjekt}
            >
              Legg til
            </Button>
          </div>
          <div className={classes.accordionWrapper}>
            <Accordion>
              {[...groupByType(sideutval, testobjektList).entries()].map(
                ([testobjektLabel, sideutvalByTestobjekt]) => {
                  const sideutvalIndexedList = sideutvalByTestobjekt.filter(
                    (su) => su.sideutval.loeysingId === selectedLoeysing.id
                  );
                  if (sideutvalIndexedList.length === 0) {
                    return null;
                  }

                  return (
                    <Accordion.Item
                      open={expanded.includes(testobjektLabel)}
                      key={testobjektLabel}
                    >
                      <Accordion.Header
                        level={6}
                        onHeaderClick={() =>
                          handleSetExpanded(testobjektLabel)
                        }
                      >
                        {testobjektLabel}
                      </Accordion.Header>
                      <Accordion.Content className={classes.centered}>
                        <div className={classes.typeFormWrapper}>
                          <SideBegrunnelseForm
                            testobjektLabel={testobjektLabel}
                            sideutvalIndexedList={sideutvalIndexedList}
                            setExpanded={handleSetExpanded}
                            handleAddSide={handleAddSide}
                            handleRemoveSide={handleRemoveSide}
                            register={register}
                          />
                        </div>
                      </Accordion.Content>
                    </Accordion.Item>
                  );
                }
              )}
            </Accordion>
            {alert && <Alert severity={alert.severity}>{alert.message}</Alert>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideutvalAccordion;
