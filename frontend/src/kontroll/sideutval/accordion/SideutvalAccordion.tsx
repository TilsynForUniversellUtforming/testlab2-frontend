import useAlert from '@common/alert/useAlert';
import { ButtonSize, ButtonVariant } from '@common/types';
import { sanitizeEnumLabel } from '@common/util/stringutils';
import {
  Accordion,
  Alert,
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

import classes from '../../kontroll.module.css';
import { groupByType, toSelectableInnhaldstype } from '../sideutval-util';
import { InnhaldstypeKontroll, Sideutval } from '../types';
import SideutvalAccordionItem from './SideutvalAccordionItem';

interface Props {
  selectedLoeysing: Loeysing;
  sideutval: Sideutval[];
  handleAddSideutval: (sideutval: Sideutval) => void;
  handleRemoveInnhaldstype: (typeId: number, egendefinertType?: string) => void;
  innhaldstypeList: InnhaldstypeKontroll[];
}

const SideutvalAccordion = ({
  sideutval,
  handleAddSideutval,
  handleRemoveInnhaldstype,
  innhaldstypeList,
  selectedLoeysing,
}: Props) => {
  const [selectableInnhaldstype, setSelectableInnhaldstype] = useState<
    InnhaldstypeKontroll[]
  >(toSelectableInnhaldstype(innhaldstypeList, sideutval));
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

    const newSideutval: Sideutval = {
      loeysingId: selectedLoeysing.id,
      typeId: innhaldstypeToAdd.id,
      begrunnelse: '',
      url: '',
      egendefinertType: egendefinertType,
    };

    // Hvis man legger til en ny innhaldstype som ikke er egendefinert, ta bort denne fra dropdown
    if (!egendefinertType) {
      setSelectableInnhaldstype((prev) =>
        prev.filter((it) => it.id !== innhaldstypeToAdd.id)
      );
    }

    if (innhaldstypeToAdd) {
      handleAddSideutval(newSideutval);
      setInnhaldstypeToAdd(undefined);
      setEgendefinertType('');
    }
  };

  useEffect(() => {
    // Lukk alle ved ending av selectedLoeysing
    setExpanded([]);
    setSelectableInnhaldstype(
      toSelectableInnhaldstype(innhaldstypeList, sideutval)
    );
  }, [selectedLoeysing]);

  useEffect(() => {
    setSelectableInnhaldstype(
      toSelectableInnhaldstype(innhaldstypeList, sideutval)
    );
  }, [sideutval]);

  const sideutvalByType = groupByType(sideutval, innhaldstypeList);

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
              {[...sideutvalByType.keys()].map((key) => {
                const sideutval = sideutvalByType.get(key) || [];
                const innhaldstypeLabel = sanitizeEnumLabel(key);

                return (
                  <SideutvalAccordionItem
                    expanded={expanded.includes(innhaldstypeLabel)}
                    setExpanded={handleSetExpanded}
                    sideutval={sideutval}
                    innhaldstypeLabel={innhaldstypeLabel}
                    key={innhaldstypeLabel}
                    handleRemoveInnhaldstype={handleRemoveInnhaldstype}
                  />
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
