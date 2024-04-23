import TestlabDivider from '@common/divider/TestlabDivider';
import { ButtonSize, ButtonVariant } from '@common/types';
import { sanitizeEnumLabel } from '@common/util/stringutils';
import {
  Accordion,
  Button,
  Chip,
  Combobox,
  Heading,
  Paragraph,
  Textarea,
  Textfield,
} from '@digdir/designsystemet-react';
import { Loeysing } from '@loeysingar/api/types';
import { MinusCircleIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';

import classes from '../kontroll.module.css';
import { defaultSide, InnhaldstypeKontroll, Side, SideListItem, SideutvalLoeysing } from './types';
import { toSelectableInnhaldstype, toSideListItem } from './sideutval-util';

interface Props {
  selectedLoeysing: Loeysing;
  sideutvalLoeysing: SideutvalLoeysing;
  setSideutvalLoesying: (sideutvalLoeysing: SideutvalLoeysing) => void;
  innhaldstypeList: InnhaldstypeKontroll[];
}

interface InnhaldstypeAccordionProps {
  sideutvalLoeysing: SideutvalLoeysing;
  expandedKeys: string[];
  setExpanded: (key: string) => void;
}

interface AccordionItemProps {
  expanded: boolean;
  setExpanded: (value: string) => void;
  sideBegrunnelseList: Side[];
  innhaldstype: string;
  handleRemoveInnhaldstype: (innhaldstype: string, egendefinertType?: string) => void;
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
  const isForside = innhaldstype.toLowerCase() === 'forside';

  return (
    <>
        <Heading size="xsmall" level={5} spacing>
          Legg til {sanitizeEnumLabel(innhaldstype)}
        </Heading>

        {sideBegrunnelseList.map((sideBegrunnelse) => (
          <div key={sideBegrunnelse.key} className={classes.begrunnelseInputs}>
            <Textarea
              label="Begrunnelse for sideutvalg"
              value={sideBegrunnelse?.begrunnelse?.length !== 0 ? sideBegrunnelse?.begrunnelse : undefined}
            />
            <Textfield label="Url" value={sideBegrunnelse?.url?.length !== 0 ? sideBegrunnelse?.url : undefined} type="url" />
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
      <TestlabDivider />
      <Button
        size={ButtonSize.Small}
        variant={ButtonVariant.Quiet}
        type="button"
        onClick={() => handleRemoveInnhaldstype(innhaldstype)}
        title={
          isForside
            ? 'Forside er påkrevd'
            : ''
        }
        aria-disabled={isForside}
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
    </>
  );
};

const AccordionItem = ({
  expanded,
  setExpanded,
  sideBegrunnelseList,
  innhaldstype,
  handleRemoveInnhaldstype,
}: AccordionItemProps) => {
  const [sideList, setSideList] = useState<SideListItem[]>(toSideListItem(sideBegrunnelseList, innhaldstype));

  const handleAddSide = useCallback(() => {
    setSideList(prev => toSideListItem([...prev, defaultSide], innhaldstype));
  }, [sideBegrunnelseList, innhaldstype, sideList]);

  const handleRemoveSide = useCallback((key: string) => {
    const filteredList = sideList.filter(sl => sl.key !== key);
    setSideList(filteredList);
  }, [innhaldstype, sideList])

  return (
    <Accordion.Item open={expanded}>
        <Accordion.Header level={3} onHeaderClick={() => setExpanded(innhaldstype)}>
          {innhaldstype}
        </Accordion.Header>
        <Accordion.Content className={classes.centered}>
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
        </Accordion.Content>
    </Accordion.Item>
  );
};

const SideutvalAccordion = ({
  sideutvalLoeysing,
  setSideutvalLoesying,
  innhaldstypeList,
  selectedLoeysing,
}: Props) => {
  const [typeList, setTypeList] = useState<InnhaldstypeKontroll[]>(toSelectableInnhaldstype(innhaldstypeList, sideutvalLoeysing));
  const [innhaldstypeToAdd, setInnhaldstypeToAdd] = useState<InnhaldstypeKontroll | undefined>();
  const [egendefinertType, setEgendefinertType] = useState<string>();

  const [expanded, setExpanded] = useState<string[]>([]);

  const handleSetExpanded = (key: string) => {
    setExpanded((prevExpanded) =>
      prevExpanded.includes(key)
        ? prevExpanded.filter((p) => p !== key)
        : [...prevExpanded, key]
    );
  };

  const onChangeInnhaldstype = (values: string[]) => {
    const innhaldstypeId = parseInt(values[0]);
    const innhaldstype = typeList.find(type => type.id === innhaldstypeId);
    setInnhaldstypeToAdd(innhaldstype);
  };

  const handleAddInnhaldstype = () => {
    if (!innhaldstypeToAdd) {
      // TODO - Alert
    }

    if (innhaldstypeToAdd && innhaldstypeToAdd.innhaldstype.toLowerCase() === 'egendefinert' && !egendefinertType) {
      // TODO - Alert
    }

    const oldSideutval = sideutvalLoeysing.sideUtval;

    if (innhaldstypeToAdd) {
      const newInnhaldstype: InnhaldstypeKontroll = {
       ...innhaldstypeToAdd,
        egendefinertType: egendefinertType,
      }

      const newSideutval = [...oldSideutval, { type: newInnhaldstype, sideBegrunnelseList: [defaultSide] }];
      const newSideutvalLoeysing: SideutvalLoeysing = { ...sideutvalLoeysing, sideUtval: newSideutval };
      setSideutvalLoesying(newSideutvalLoeysing);
      setInnhaldstypeToAdd(undefined);
      setTypeList(toSelectableInnhaldstype(innhaldstypeList, newSideutvalLoeysing));
    }
  }

  const handleRemoveInnhaldstype = (innhaldstype: string, egendefinertType?: string) => {
    const oldSideutval = sideutvalLoeysing.sideUtval;
    if (innhaldstype.toLowerCase() === 'forside') {
      // TODO - Alert
    }

    if (innhaldstype.toLowerCase() === 'egendefinert' && egendefinertType) {
      return {...sideutvalLoeysing, sideutval: oldSideutval.filter(su => su.type.egendefinertType?.toLowerCase() === egendefinertType.toLowerCase())}
    } else {
      return {...sideutvalLoeysing, sideutval: oldSideutval.filter(su => su.type.innhaldstype.toLowerCase() === innhaldstype.toLowerCase())}
    }
  }

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
            Velg i nedtrekkslisten. Forside skal alltid med. 10% av
            utvalget skal være egendefinert. Velg derfor egendefinert for
            disse sidene.
          </Paragraph>
        </div>
      </div>
      <div className={classes.centered}>
        <div className={classes.sideutvalForm}>
          <div className={classes.innhaldstypeSelect}>
            <Combobox
              label="Legg til innhaldstype"
              size="small"
              value={innhaldstypeToAdd?.id ? [String(innhaldstypeToAdd.id)] : []}
              onValueChange={onChangeInnhaldstype}
              inputValue={innhaldstypeToAdd?.innhaldstype ? String(innhaldstypeToAdd.innhaldstype) : ''}
            >
              <Combobox.Empty>
                Ingen treff
              </Combobox.Empty>
              {typeList.map(tl => (
                <Combobox.Option value={String(tl.id)} key={tl.id}>
                  {tl.innhaldstype}
                </Combobox.Option>
              ))}
            </Combobox>
            <Button className={classes.innhaldstypeLagre} variant={ButtonVariant.Outline} size={ButtonSize.Small} onClick={handleAddInnhaldstype}>Legg til</Button>
          </div>
          <div className={classes.accordionWrapper}>
            <Accordion>
              {sideutvalLoeysing.sideUtval.map((sideutval) => {
                const innhaldstype =
                  sideutval.type.egendefinertType || sideutval.type.innhaldstype;

                const sideBegrunnelseList =
                  sideutval.sideBegrunnelseList.length === 0
                    ? [defaultSide]
                    : sideutval.sideBegrunnelseList;

                return (
                  <AccordionItem
                    expanded={expanded.includes(innhaldstype)}
                    setExpanded={handleSetExpanded}
                    sideBegrunnelseList={sideBegrunnelseList}
                    innhaldstype={innhaldstype}
                    key={innhaldstype}
                    handleRemoveInnhaldstype={handleRemoveInnhaldstype}
                  />
                )
              })}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideutvalAccordion;
