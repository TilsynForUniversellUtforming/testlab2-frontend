import { ButtonSize, ButtonVariant } from '@common/types';
import {
  Accordion,
  Button,
  Chip,
  Combobox,
  Heading,
  Paragraph,
  Textfield,
} from '@digdir/designsystemet-react';
import { Loeysing } from '@loeysingar/api/types';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { FieldArrayWithId, UseFormRegister } from 'react-hook-form';

import classes from '../../kontroll.module.css';
import SideBegrunnelseForm from '../form/SideBegrunnelseForm';
import { groupByType, toSelectableSideutvalType } from '../sideutval-util';
import { FormError, SideutvalForm, SideutvalTypeKontroll } from '../types';

interface Props {
  selectedLoeysing: Loeysing;
  sideutval: FieldArrayWithId<SideutvalForm, 'sideutval', 'id'>[];
  handleAddSide: (
    loeysingId: number,
    typeId: number,
    egendefinertType?: string
  ) => void;
  formErrors: FormError[];
  handleRemoveSide: (indices: number[]) => void;
  sideutvalTypeList: SideutvalTypeKontroll[];
  register: UseFormRegister<SideutvalForm>;
}

const SideutvalAccordion = ({
  sideutval,
  handleAddSide,
  handleRemoveSide,
  formErrors,
  sideutvalTypeList,
  selectedLoeysing,
  register,
}: Props) => {
  const [selectableSideutvalType, setSelectableSideutvalType] = useState<
    SideutvalTypeKontroll[]
  >(
    toSelectableSideutvalType(sideutvalTypeList, sideutval, selectedLoeysing.id)
  );
  const [sideutvalTypeToAdd, setSideutvalTypeToAdd] = useState<
    SideutvalTypeKontroll | undefined
  >();
  const [egendefinertType, setEgendefinertType] = useState<string>('');
  const [expanded, setExpanded] = useState<string[]>([]);
  const [typeError, setTypeError] = useState<
    { type?: string; egendefinert?: string } | undefined
  >();

  const handleSetExpanded = (key: string) => {
    setExpanded((prevExpanded) =>
      prevExpanded.includes(key)
        ? prevExpanded.filter((p) => p !== key)
        : [...prevExpanded, key]
    );
  };

  const onChangeSideutvalType = (values: string[]) => {
    const sideutvalTypeId = parseInt(values[0]);
    const sideutvalType = selectableSideutvalType.find(
      (type) => type.id === sideutvalTypeId
    );
    setSideutvalTypeToAdd(sideutvalType);
  };

  const handleAddSideutvalType = () => {
    if (!sideutvalTypeToAdd) {
      setTypeError({ type: 'Ugyldig sidetype' });
      return;
    }

    if (
      sideutvalTypeToAdd &&
      sideutvalTypeToAdd.type.toLowerCase() === 'egendefinert' &&
      !egendefinertType
    ) {
      setTypeError({
        egendefinert: 'Egendefinert sidetype kan ikkje vera tom',
      });
      return;
    }

    // Hvis man legger til en ny sideutvalType som ikke er egendefinert, ta bort denne fra dropdown
    if (!egendefinertType) {
      setSelectableSideutvalType((prev) =>
        prev.filter((it) => it.id !== sideutvalTypeToAdd.id)
      );
    }

    if (sideutvalTypeToAdd) {
      handleAddSide(
        selectedLoeysing.id,
        sideutvalTypeToAdd.id,
        egendefinertType
      );
      setSideutvalTypeToAdd(undefined);
      setTypeError(undefined);
      setEgendefinertType('');
    }
  };

  useEffect(() => {
    // Lukk alle accordion items det ikke er feil på ved endring av løysing
    setExpanded(
      formErrors
        .filter((fe) => fe.loeysingId === selectedLoeysing.id)
        .map((fe) => fe.sideutvalType)
    );
    setSelectableSideutvalType(
      toSelectableSideutvalType(
        sideutvalTypeList,
        sideutval,
        selectedLoeysing.id
      )
    );
  }, [selectedLoeysing]);

  useEffect(() => {
    setSelectableSideutvalType(
      toSelectableSideutvalType(
        sideutvalTypeList,
        sideutval,
        selectedLoeysing.id
      )
    );
  }, [sideutval]);

  useEffect(() => {
    // Åpne alle accordion items det er feil på
    if (formErrors.length > 0) {
      setExpanded(
        formErrors
          .filter((fe) => fe.loeysingId === selectedLoeysing.id)
          .map((fe) => fe.sideutvalType)
      );
    }
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
            <Chip.Toggle
              disabled
              title="Test av mobil er ikkje tilgjengelig ennå"
            >
              Test av mobil
            </Chip.Toggle>
          </Chip.Group>
          <Paragraph size="medium">
            Vel i nedtrekklista. Forside skal alltid med. 10% av utvalet skal
            vera eigendefinert. Vel derfor eigendefinert for desse sidene.
          </Paragraph>
        </div>
      </div>
      <div className={classes.centered}>
        <div className={classes.sideutvalForm}>
          <div className={classes.sideutvaltypeSelect}>
            <Combobox
              label="Legg til sidetype"
              size="small"
              value={
                sideutvalTypeToAdd?.id ? [String(sideutvalTypeToAdd.id)] : []
              }
              onValueChange={onChangeSideutvalType}
              inputValue={
                sideutvalTypeToAdd?.type ? String(sideutvalTypeToAdd.type) : ''
              }
              error={typeError?.type}
            >
              <Combobox.Empty>Ingen treff</Combobox.Empty>
              {selectableSideutvalType.map((tl) => (
                <Combobox.Option value={String(tl.id)} key={tl.id}>
                  {tl.type}
                </Combobox.Option>
              ))}
            </Combobox>
            {sideutvalTypeToAdd?.type?.toLowerCase() === 'egendefinert' && (
              <Textfield
                label="Egendefinert sidetype"
                size="small"
                value={egendefinertType?.length !== 0 ? egendefinertType : ''}
                onChange={(e) => setEgendefinertType(e.target.value)}
                error={typeError?.egendefinert}
              />
            )}
            <Button
              className={classes.sideutvaltypeLagre}
              variant={ButtonVariant.Outline}
              size={ButtonSize.Small}
              onClick={handleAddSideutvalType}
            >
              Legg til
            </Button>
          </div>
          <div className={classes.accordionWrapper}>
            <Accordion>
              {[...groupByType(sideutval, sideutvalTypeList).entries()].map(
                ([sideutvalTypeLabel, sideutvalBySideutvalType]) => {
                  const sideutvalIndexedList = sideutvalBySideutvalType.filter(
                    (su) => su.sideutval.loeysingId === selectedLoeysing.id
                  );
                  if (sideutvalIndexedList.length === 0) {
                    return null;
                  }

                  return (
                    <Accordion.Item
                      open={expanded.includes(sideutvalTypeLabel)}
                      key={sideutvalTypeLabel}
                    >
                      <Accordion.Header
                        level={6}
                        onHeaderClick={() =>
                          handleSetExpanded(sideutvalTypeLabel)
                        }
                      >
                        {sideutvalTypeLabel}
                      </Accordion.Header>
                      <Accordion.Content>
                        <SideBegrunnelseForm
                          sideutvalTypeLabel={sideutvalTypeLabel}
                          sideutvalIndexedList={sideutvalIndexedList}
                          setExpanded={handleSetExpanded}
                          handleAddSide={handleAddSide}
                          handleRemoveSide={handleRemoveSide}
                          register={register}
                        />
                      </Accordion.Content>
                    </Accordion.Item>
                  );
                }
              )}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideutvalAccordion;
