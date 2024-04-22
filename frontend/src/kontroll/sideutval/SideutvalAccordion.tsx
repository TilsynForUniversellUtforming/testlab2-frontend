import TestlabDivider from '@common/divider/TestlabDivider';
import { ButtonSize, ButtonVariant } from '@common/types';
import { sanitizeEnumLabel } from '@common/util/stringutils';
import { Button, Chip, Heading, Paragraph, Textfield, } from '@digdir/designsystemet-react';
import { Loeysing } from '@loeysingar/api/types';
import { MinusCircleIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';

import classes from '../kontroll.module.css';
import { defaultSide, InnhaldstypeKontroll, Side, SideListItem, SideutvalLoeysing } from './types';
import { toSideListItem } from './sideutval-util';

interface Props {
  selectedLoeysing: Loeysing;
  sideutvalLoeysing: SideutvalLoeysing | undefined;
  innhaldstypeList: InnhaldstypeKontroll[];
}

interface AccordionItemProps {
  expanded: boolean;
  setExpanded: (value: string) => void;
  sideBegrunnelseList: Side[];
  innhaldstype: string;
}

interface SideBegrunnelseFormProps {
  innhaldstype: string;
  sideBegrunnelseList: SideListItem[];
  setExpanded: (value: string) => void;
  handleAddSide: () => void;
  handleRemoveSide: (key: string) => void;
  handleRemoveInnhaldstype: (innhaldstype: string) => void;
}

const SideBegrunnelseForm = ({
  innhaldstype,
  sideBegrunnelseList,
  handleAddSide,
  handleRemoveSide,
  handleRemoveInnhaldstype,
}: SideBegrunnelseFormProps) => {
  const hasMultipleItems = sideBegrunnelseList.length > 1;

  return (
    <div className={classes.sideutvalForm}>
      <div className={classes.inputs}>
        <Heading size="xsmall" level={5} spacing>
          Legg til {sanitizeEnumLabel(innhaldstype)}
        </Heading>
        {sideBegrunnelseList.map((sideBegrunnelse, idx) => (
          <div key={sideBegrunnelse.key} className={classes.inputs}>
            <Textfield
              label="Begrunnelse for sideutvalg"
              value={sideBegrunnelse?.begrunnelse}
            />
            <Textfield label="Url" value={sideBegrunnelse?.url} type="url" />
            {hasMultipleItems &&
              <Button
                size={ButtonSize.Small}
                variant={ButtonVariant.Quiet}
                type="button"
                onClick={() => handleRemoveSide(sideBegrunnelse.key)}
              >
                <MinusCircleIcon />
                Ta bort side
              </Button>
            }
          </div>
        ))}
      </div>
      <TestlabDivider />
      <Button
        size={ButtonSize.Small}
        variant={ButtonVariant.Quiet}
        type="button"
        onClick={() => handleRemoveInnhaldstype(innhaldstype)}
        title={
          sideBegrunnelseList.length === 1 && innhaldstype.toLowerCase() === 'forside'
            ? 'Forside er påkrevd'
            : ''
        }
        aria-disabled={sideBegrunnelseList.length === 1}
      >
        <MinusCircleIcon />
        Fjern innhaldstype {sanitizeEnumLabel(innhaldstype)}
      </Button>
      <Button
        size={ButtonSize.Small}
        variant={ButtonVariant.Quiet}
        type="button"
        onClick={handleAddSide}
      >
        <PlusCircleIcon />
        Legg til fleire sider innan {sanitizeEnumLabel(innhaldstype)}
      </Button>
    </div>
  );
};

const AccordionItem = ({
  expanded,
  setExpanded,
  sideBegrunnelseList,
  innhaldstype,
}: AccordionItemProps) => {
  const [sideList, setSideList] = useState<SideListItem[]>(toSideListItem(sideBegrunnelseList, innhaldstype));

  const handleAddSide = useCallback(() => {
    setSideList(prev => toSideListItem([...prev, defaultSide], innhaldstype));
  }, [sideBegrunnelseList, innhaldstype]);

  const handleRemoveSide = useCallback((key: string) => {
    const filteredList = sideList.filter(sl => sl.key !== key);
    setSideList(filteredList);
  }, [innhaldstype])

  const handleRemoveInnhaldstype = useCallback((innhaldstype: string) => {
  }, [sideBegrunnelseList, innhaldstype])

  return (
    <div className={classes.accordionItem}>
      {!expanded && (
        <button
          onClick={() => setExpanded(innhaldstype)}
          className={classes.accordionButton}
        >
          <div className={classes.accordionButtonTitle}>{innhaldstype}</div>
        </button>
      )}
      {expanded && (
        <div className={classes.centered}>
          <div className={classes.typeFormWrapper}>
            <SideBegrunnelseForm
              innhaldstype={innhaldstype}
              sideBegrunnelseList={sideList}
              setExpanded={setExpanded}
              handleAddSide={handleAddSide}
              handleRemoveSide={handleRemoveSide}
              handleRemoveInnhaldstype={handleRemoveInnhaldstype}
            />
            <TestlabDivider />
            <div className={classes.lagreSideutvalNettside}>
              <Button
                size={ButtonSize.Small}
                variant={ButtonVariant.Outline}
                onClick={() => setExpanded(innhaldstype)}
              >
                Lukk
              </Button>
              <Button size={ButtonSize.Small}>
                Lagre {sanitizeEnumLabel(innhaldstype)}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SideutvalAccordion = ({
  sideutvalLoeysing,
  innhaldstypeList,
  selectedLoeysing,
}: Props) => {
  const [expanded, setExpanded] = useState<string[]>([]);

  const handleSetExpanded = (key: string) => {
    setExpanded((prevExpanded) =>
      prevExpanded.includes(key)
        ? prevExpanded.filter((p) => p !== key)
        : [...prevExpanded, key]
    );
  };

  useEffect(() => {
    // Lukk alle ved ending av selectedLoeysing
    setExpanded([]);
  }, [selectedLoeysing]);

  return (
    <div className={classes.accordion}>
      {sideutvalLoeysing?.sideUtval.map((sideutval) => {
        const innhaldstype =
          sideutval.type.egendefinertType || sideutval.type.innhaldstype;

        const sideBegrunnelseList =
          sideutval.sideBegrunnelseList.length === 0
            ? [defaultSide]
            : sideutval.sideBegrunnelseList;

        return (
          <div key={innhaldstype}>
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
                  Velg i nedtrekkslisten. Forside skal alltid med. 10% av
                  utvalget skal være egendefinert. Velg derfor egendefinert for
                  disse sidene. Øvrige hjelpetekster her.
                </Paragraph>
              </div>
            </div>
            <AccordionItem
              expanded={expanded.includes(innhaldstype)}
              setExpanded={handleSetExpanded}
              sideBegrunnelseList={sideBegrunnelseList}
              innhaldstype={innhaldstype}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SideutvalAccordion;
