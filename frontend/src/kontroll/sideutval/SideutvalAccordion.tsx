import useAlert from '@common/alert/useAlert';
import ConfirmModalButton from '@common/confirm-modal/ConfirmModalButton';
import TestlabDivider from '@common/divider/TestlabDivider';
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
  Textarea,
  Textfield,
} from '@digdir/designsystemet-react';
import { Loeysing } from '@loeysingar/api/types';
import { MinusCircleIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';

import classes from '../kontroll.module.css';
import { toSelectableInnhaldstype, toSideListItem } from './sideutval-util';
import {
  defaultSide,
  InnhaldstypeKontroll,
  Side,
  SideListItem,
  SideutvalLoeysing,
} from './types';

interface Props {
  selectedLoeysing: Loeysing;
  sideutvalLoeysing: SideutvalLoeysing;
  setSideutvalLoesying: (sideutvalLoeysing: SideutvalLoeysing) => void;
  innhaldstypeList: InnhaldstypeKontroll[];
}

interface AccordionItemProps {
  expanded: boolean;
  setExpanded: (value: string) => void;
  sideBegrunnelseList: Side[];
  type: InnhaldstypeKontroll;
  handleRemoveInnhaldstype: (
    innhaldstype: string,
    egendefinertType: string | undefined
  ) => void;
}

interface SideBegrunnelseFormProps {
  type: InnhaldstypeKontroll;
  sideBegrunnelseList: SideListItem[];
  setExpanded: (value: string) => void;
  handleAddSide: () => void;
  handleRemoveSide: (key: string) => void;
  handleRemoveInnhaldstype: (
    innhaldstype: string,
    egendefinertType: string | undefined
  ) => void;
}

const SideBegrunnelseForm = ({
  type,
  sideBegrunnelseList,
  handleAddSide,
  handleRemoveSide,
  handleRemoveInnhaldstype,
}: SideBegrunnelseFormProps) => {
  const hasMultipleItems = sideBegrunnelseList.length > 1;
  const innhaldstype = type.innhaldstype;
  const isForside = innhaldstype.toLowerCase() === 'forside';
  const innhaldstypeLabel = sanitizeEnumLabel(
    type.egendefinertType || innhaldstype
  );

  return (
    <>
      <Heading size="xsmall" level={5} spacing>
        Legg til {innhaldstypeLabel}
      </Heading>

      {sideBegrunnelseList.map((sideBegrunnelse) => (
        <div key={sideBegrunnelse.key} className={classes.begrunnelseInputs}>
          <Textarea
            label="Begrunnelse for sideutvalg"
            value={
              sideBegrunnelse?.begrunnelse?.length !== 0
                ? sideBegrunnelse?.begrunnelse
                : undefined
            }
          />
          <Textfield
            label="Url"
            value={
              sideBegrunnelse?.url?.length !== 0
                ? sideBegrunnelse?.url
                : undefined
            }
            type="url"
          />
          {hasMultipleItems && (
            <Button
              size={ButtonSize.Small}
              variant={ButtonVariant.Quiet}
              type="button"
              onClick={() => handleRemoveSide(sideBegrunnelse.key)}
            >
              <MinusCircleIcon />
              Ta bort side
            </Button>
          )}
        </div>
      ))}
      <TestlabDivider />
      <ConfirmModalButton
        size={ButtonSize.Small}
        variant={ButtonVariant.Quiet}
        type="button"
        title={
          isForside
            ? 'Forside er påkrevd'
            : `Fjern innhaldstype ${innhaldstypeLabel}`
        }
        disabled={isForside}
        message={'Vil du ta bort hele innhaldstypen? Dette kan ikkje angrast'}
        onConfirm={() =>
          handleRemoveInnhaldstype(innhaldstype, type.egendefinertType)
        }
        buttonIcon={<MinusCircleIcon />}
      />
      <Button
        size={ButtonSize.Small}
        variant={ButtonVariant.Quiet}
        type="button"
        onClick={handleAddSide}
      >
        <PlusCircleIcon />
        Legg til fleire sider innan {innhaldstypeLabel}
      </Button>
    </>
  );
};

const AccordionItem = ({
  expanded,
  setExpanded,
  sideBegrunnelseList,
  type,
  handleRemoveInnhaldstype,
}: AccordionItemProps) => {
  const innhaldsType = type.egendefinertType || type.innhaldstype;
  const innhaldsTypeLabel = sanitizeEnumLabel(innhaldsType);
  const [sideList, setSideList] = useState<SideListItem[]>(
    toSideListItem(sideBegrunnelseList, innhaldsType)
  );

  const handleAddSide = useCallback(() => {
    setSideList((prev) => toSideListItem([...prev, defaultSide], innhaldsType));
  }, [sideBegrunnelseList, type, sideList]);

  const handleRemoveSide = useCallback(
    (key: string) => {
      const filteredList = sideList.filter((sl) => sl.key !== key);
      setSideList(filteredList);
    },
    [type, sideList]
  );

  return (
    <Accordion.Item open={expanded}>
      <Accordion.Header
        level={6}
        onHeaderClick={() => setExpanded(innhaldsType)}
      >
        {innhaldsTypeLabel}
      </Accordion.Header>
      <Accordion.Content className={classes.centered}>
        <div className={classes.typeFormWrapper}>
          <SideBegrunnelseForm
            type={type}
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
              onClick={() => setExpanded(innhaldsType)}
            >
              Lukk
            </Button>
            <Button size={ButtonSize.Small}>Lagre {innhaldsTypeLabel}</Button>
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

    const oldSideutval = sideutvalLoeysing.sideUtval;

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
        sideUtval: newSideutval,
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
    const oldSideutval = sideutvalLoeysing.sideUtval;
    if (innhaldstype.toLowerCase() === 'forside') {
      setAlert('danger', 'Kan ikkje ta bort forside');
    }

    if (innhaldstype.toLowerCase() === 'egendefinert' && egendefinertType) {
      setSideutvalLoesying({
        ...sideutvalLoeysing,
        sideUtval: oldSideutval.filter(
          (su) =>
            su.type.egendefinertType?.toLowerCase() !==
            egendefinertType.toLowerCase()
        ),
      });
    } else {
      setSideutvalLoesying({
        ...sideutvalLoeysing,
        sideUtval: oldSideutval.filter(
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
              {sideutvalLoeysing.sideUtval.map((sideutval) => {
                const innhaldstypeLabel =
                  sideutval.type.egendefinertType ||
                  sideutval.type.innhaldstype;

                const sideBegrunnelseList =
                  sideutval.sideBegrunnelseList.length === 0
                    ? [defaultSide]
                    : sideutval.sideBegrunnelseList;

                return (
                  <AccordionItem
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
