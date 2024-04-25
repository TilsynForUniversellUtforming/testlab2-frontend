import useAlert from '@common/alert/useAlert';
import { ButtonSize, ButtonVariant } from '@common/types';
import { Accordion, Alert, Button, Chip, Combobox, Heading, Paragraph, Textfield, } from '@digdir/designsystemet-react';
import { Loeysing } from '@loeysingar/api/types';
import classNames from 'classnames';
import { useEffect, useState } from 'react';

import classes from '../../kontroll.module.css';
import { toSelectableInnhaldstype } from '../sideutval-util';
import { defaultSide, InnhaldstypeKontroll, SideutvalLoeysing, } from '../types';
import SideutvalAccordionItem from './SideutvalAccordionItem';

interface Props {
  selectedLoeysing: Loeysing;
  sideutvalLoeysing: SideutvalLoeysing;
  setSideutvalLoesying: (sideutvalLoeysing: SideutvalLoeysing) => void;
  innhaldstypeList: InnhaldstypeKontroll[];
}

const SideutvalAccordion = ({
  sideutvalLoeysing,
  setSideutvalLoesying,
  innhaldstypeList,
  selectedLoeysing,
}: Props) => {
  const [typeList, setTypeList] = useState<InnhaldstypeKontroll[]>(
    toSelectableInnhaldstype(innhaldstypeList, sideutvalLoeysing)
  );
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
    const innhaldstype = typeList.find((type) => type.id === innhaldstypeId);
    setInnhaldstypeToAdd(innhaldstype);
  };

  const handleAddInnhaldstype = () => {
    if (!innhaldstypeToAdd) {
      setAlert('danger', 'Ugylding innhaldstype');
    }

    if (
      innhaldstypeToAdd &&
      innhaldstypeToAdd.innhaldstype.toLowerCase() === 'egendefinert' &&
      !egendefinertType
    ) {
      setAlert('danger', 'Ugylding innhaldstype');
    }

    const oldSideutval = sideutvalLoeysing.sideutval;

    if (innhaldstypeToAdd) {
      const newInnhaldstype: InnhaldstypeKontroll = {
        ...innhaldstypeToAdd,
        egendefinertType: egendefinertType,
      };

      const newSideutval = [
        ...oldSideutval,
        { type: newInnhaldstype, sideBegrunnelseList: [defaultSide] },
      ];
      const newSideutvalLoeysing: SideutvalLoeysing = {
        ...sideutvalLoeysing,
        sideutval: newSideutval,
      };
      setSideutvalLoesying(newSideutvalLoeysing);
      setInnhaldstypeToAdd(undefined);
      setEgendefinertType('');
      setTypeList(
        toSelectableInnhaldstype(innhaldstypeList, newSideutvalLoeysing)
      );
    }
  };

  const handleRemoveInnhaldstype = (
    innhaldstype: string,
    egendefinertType?: string
  ) => {
    const oldSideutval = sideutvalLoeysing.sideutval;
    if (innhaldstype.toLowerCase() === 'forside') {
      setAlert('danger', 'Kan ikkje ta bort forside');
    }

    if (innhaldstype.toLowerCase() === 'egendefinert' && egendefinertType) {
      setSideutvalLoesying({
        ...sideutvalLoeysing,
        sideutval: oldSideutval.filter(
          (su) =>
            su.type.egendefinertType?.toLowerCase() !==
            egendefinertType.toLowerCase()
        ),
      });
    } else {
      setSideutvalLoesying({
        ...sideutvalLoeysing,
        sideutval: oldSideutval.filter(
          (su) =>
            su.type.innhaldstype.toLowerCase() !== innhaldstype.toLowerCase()
        ),
      });
    }
  };

  useEffect(() => {
    // Lukk alle ved ending av selectedLoeysing
    setExpanded([]);
  }, [selectedLoeysing]);

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
              {typeList.map((tl) => (
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
                {sideutvalLoeysing.sideutval.map((sideutval) => {
                const innhaldstypeLabel =
                  sideutval.type.egendefinertType ||
                  sideutval.type.innhaldstype;

                const sideBegrunnelseList =
                  sideutval.sideBegrunnelseList.length === 0
                    ? [defaultSide]
                    : sideutval.sideBegrunnelseList;

                return (
                  <SideutvalAccordionItem
                    expanded={expanded.includes(innhaldstypeLabel)}
                    setExpanded={handleSetExpanded}
                    sideBegrunnelseList={sideBegrunnelseList}
                    type={sideutval.type}
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
