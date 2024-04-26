import useAlert from '@common/alert/useAlert';
import { ButtonSize, ButtonVariant } from '@common/types';
import { sanitizeEnumLabel } from '@common/util/stringutils';
import { Accordion, Alert, Button, Chip, Combobox, Heading, Paragraph, Textfield, } from '@digdir/designsystemet-react';
import { Loeysing } from '@loeysingar/api/types';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { UseFormRegister } from 'react-hook-form';

import classes from '../../kontroll.module.css';
import SideBegrunnelseForm from '../form/SideBegrunnelseForm';
import { toSelectableInnhaldstype } from '../sideutval-util';
import { InnhaldstypeKontroll, SideutvalForm, SideutvalIndexed } from '../types';

interface Props {
  selectedLoeysing: Loeysing;
  sideutvalByInnhaldstype: Map<string, SideutvalIndexed[]>
  handleAddSide: (
    loeysingId: number,
    typeId: number,
    egendefinertType?: string
  ) => void;
  handleRemoveSide: (indices: number[]) => void;
  innhaldstypeList: InnhaldstypeKontroll[];
  register: UseFormRegister<SideutvalForm>;
}

const SideutvalAccordion = ({
  sideutvalByInnhaldstype,
  handleAddSide,
  handleRemoveSide,
  innhaldstypeList,
  selectedLoeysing,
  register,
}: Props) => {
  const sideutvalLoeysing = [...sideutvalByInnhaldstype.values()].flat()
    .map(su => su.sideutval)
    .filter(su => su.loeysingId === selectedLoeysing.id);

  const [selectableInnhaldstype, setSelectableInnhaldstype] = useState<
    InnhaldstypeKontroll[]
  >(toSelectableInnhaldstype(innhaldstypeList, sideutvalLoeysing));
  const [innhaldstypeToAdd, setInnhaldstypeToAdd] = useState<
    InnhaldstypeKontroll | undefined
  >();
  const [egendefinertType, setEgendefinertType] = useState<string>('');
  const [expanded, setExpanded] = useState<string[]>([]);
  const [alert, setAlert] = useAlert();

  const handleSetExpanded = (key: string) => {
    setExpanded((prevExpanded) =>
      prevExpanded.includes(key)
        ? prevExpanded.filter((p) => p !== key)
        : [...prevExpanded, key]
    );
  };

  const onChangeInnhaldstype = (values: string[]) => {
    const innhaldstypeId = parseInt(values[0]);
    const innhaldstype = selectableInnhaldstype.find(
      (type) => type.id === innhaldstypeId
    );
    setInnhaldstypeToAdd(innhaldstype);
  };

  const handleAddInnhaldstype = () => {
    if (!innhaldstypeToAdd) {
      setAlert('danger', 'Ugylding innhaldstype');
      return;
    }

    if (
      innhaldstypeToAdd &&
      innhaldstypeToAdd.innhaldstype.toLowerCase() === 'egendefinert' &&
      !egendefinertType
    ) {
      setAlert('danger', 'Ugylding innhaldstype');
      return;
    }

    // Hvis man legger til en ny innhaldstype som ikke er egendefinert, ta bort denne fra dropdown
    if (!egendefinertType) {
      setSelectableInnhaldstype((prev) =>
        prev.filter((it) => it.id !== innhaldstypeToAdd.id)
      );
    }

    if (innhaldstypeToAdd) {
      handleAddSide(
        Number(selectedLoeysing.id),
        Number(innhaldstypeToAdd.id),
        egendefinertType
      );
      setInnhaldstypeToAdd(undefined);
      setEgendefinertType('');
    }
  };

  useEffect(() => {
    // Lukk alle ved ending av selectedLoeysing
    setExpanded([]);

    const sideutvalLoeysing = [...sideutvalByInnhaldstype.values()].flat()
      .map(su => su.sideutval)
      .filter(su => su.loeysingId === selectedLoeysing.id);
    setSelectableInnhaldstype(
      toSelectableInnhaldstype(innhaldstypeList, sideutvalLoeysing)
    );
  }, [selectedLoeysing]);

  useEffect(() => {
    const sideutvalLoeysing = [...sideutvalByInnhaldstype.values()].flat()
      .map(su => su.sideutval)
      .filter(su => su.loeysingId === selectedLoeysing.id);
    
    setSelectableInnhaldstype(
      toSelectableInnhaldstype(innhaldstypeList, sideutvalLoeysing)
    );
  }, [sideutvalByInnhaldstype]);

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
          <div className={classes.innhaldstypeSelect}>
            <Combobox
              label="Legg til innhaldstype"
              size="small"
              value={
                innhaldstypeToAdd?.id ? [String(innhaldstypeToAdd.id)] : []
              }
              onValueChange={onChangeInnhaldstype}
              inputValue={
                innhaldstypeToAdd?.innhaldstype
                  ? String(innhaldstypeToAdd.innhaldstype)
                  : ''
              }
            >
              <Combobox.Empty>Ingen treff</Combobox.Empty>
              {selectableInnhaldstype.map((tl) => (
                <Combobox.Option value={String(tl.id)} key={tl.id}>
                  {tl.innhaldstype}
                </Combobox.Option>
              ))}
            </Combobox>
            {innhaldstypeToAdd?.innhaldstype?.toLowerCase() ===
              'egendefinert' && (
              <Textfield
                label="Egendefinert innhaldstype"
                value={
                  egendefinertType?.length !== 0 ? egendefinertType : undefined
                }
                onChange={(e) => setEgendefinertType(e.target.value)}
              />
            )}
            <Button
              className={classes.innhaldstypeLagre}
              variant={ButtonVariant.Outline}
              size={ButtonSize.Small}
              onClick={handleAddInnhaldstype}
            >
              Legg til
            </Button>
          </div>
          <div className={classes.accordionWrapper}>
            <Accordion>
              {[...sideutvalByInnhaldstype.keys()].map((key) => {
                const sideutvalIndexedList = (sideutvalByInnhaldstype.get(key) || [])
                  .filter(su => su.sideutval.loeysingId === selectedLoeysing.id);
                if (sideutvalIndexedList.length === 0) {
                  return null;
                }

                const innhaldstypeLabel = sanitizeEnumLabel(key);

                return (
                  <Accordion.Item
                    open={expanded.includes(innhaldstypeLabel)}
                    key={key}
                  >
                    <Accordion.Header
                      level={6}
                      onHeaderClick={() => handleSetExpanded(innhaldstypeLabel)}
                    >
                      {innhaldstypeLabel}
                    </Accordion.Header>
                    <Accordion.Content className={classes.centered}>
                      <div className={classes.typeFormWrapper}>
                        <SideBegrunnelseForm
                          innhaldstypeLabel={innhaldstypeLabel}
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
              })}
            </Accordion>
            {alert && <Alert severity={alert.severity}>{alert.message}</Alert>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideutvalAccordion;
