import { ButtonSize, ButtonVariant } from '@common/types';
import {
  Button,
  Chip,
  Details,
  Heading,
  Paragraph,
  Textfield,
  EXPERIMENTAL_Suggestion as Suggestion,
  Select,
} from '@digdir/designsystemet-react';
import { Loeysing } from '@loeysingar/api/types';
import classNames from 'classnames';
import { SyntheticEvent, useEffect, useState } from 'react';
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

  const onChangeSideutvalType = (event:React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const sideutvalTypeId = Number.parseInt(value);
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
          <Heading level={5} data-size="sm">
            {selectedLoeysing.namn}
          </Heading>
          <Chip.Radio defaultChecked>Test av nettside</Chip.Radio>
          <Chip.Radio disabled title="Test av mobil er ikkje tilgjengelig ennå">
            Test av mobil
          </Chip.Radio>
          <Paragraph data-size="md">
            Vel i nedtrekklista. Forside skal alltid med. 10% av utvalet skal
            vera eigendefinert. Vel derfor eigendefinert for desse sidene.
          </Paragraph>
        </div>
      </div>
      <div className={classes.centered}>
        <div className={classes.sideutvalForm}>
          <div className={classes.sideutvaltypeSelect}>
            <Select
              aria-label="Legg til sidetype"
              data-size="sm"
              defaultValue={''}
              onChange={onChangeSideutvalType}
            >
              <Select.Option value={''} disabled>
                Velg ein sidetype
              </Select.Option>
              {selectableSideutvalType.map((tl) => (
                <Select.Option value={String(tl.id)} key={tl.id}>
                  {tl.type}
                </Select.Option>
              ))}
            </Select>
            {sideutvalTypeToAdd?.type?.toLowerCase() === 'egendefinert' && (
              <Textfield
                label="Egendefinert sidetype"
                data-size="sm"
                value={egendefinertType?.length === 0 ? '' : egendefinertType}
                onChange={(e) => setEgendefinertType(e.target.value)}
                error={typeError?.egendefinert}
              />
            )}
            <Button
              className={classes.sideutvaltypeLagre}
              variant={ButtonVariant.Outline}
              data-size={ButtonSize.Small}
              onClick={handleAddSideutvalType}
            >
              Legg til
            </Button>
          </div>
          <div className={classes.accordionWrapper}>
            <ul>
              {Array.from(
                groupByType(sideutval, sideutvalTypeList).entries()
              ).map(([sideutvalTypeLabel, sideutvalBySideutvalType]) => {
                const sideutvalIndexedList = sideutvalBySideutvalType.filter(
                  (su) => su.sideutval.loeysingId === selectedLoeysing.id
                );
                if (sideutvalIndexedList.length === 0) return null;
                const errors = formErrors.find(
                  (fe) =>
                    fe.sideutvalType === sideutvalTypeLabel &&
                    fe.loeysingId === selectedLoeysing.id
                );
                return (
                  <li key={sideutvalTypeLabel}>
                    <Details>
                      <Details.Summary>
                        {sideutvalTypeLabel}
                        {errors && <> ({errors.antallFeil} feil)</>}
                      </Details.Summary>
                      <Details.Content>
                        <SideBegrunnelseForm
                          sideutvalTypeLabel={sideutvalTypeLabel}
                          sideutvalIndexedList={sideutvalIndexedList}
                          setExpanded={handleSetExpanded}
                          handleAddSide={handleAddSide}
                          handleRemoveSide={handleRemoveSide}
                          register={register}
                        />
                      </Details.Content>
                    </Details>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideutvalAccordion;
