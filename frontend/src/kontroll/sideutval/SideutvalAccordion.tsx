import { ButtonSize, ButtonVariant } from '@common/types';
import { sanitizeEnumLabel } from '@common/util/stringutils';
import { Button, Heading, Textfield } from '@digdir/designsystemet-react';
import { useState } from 'react';

import classes from '../kontroll.module.css';
import { InnhaldstypeKontroll, Side, SideutvalLoeysing, } from './types';
import TestlabDivider from '@common/divider/TestlabDivider';

interface Props {
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
  sideBegrunnelse?: Side;
  setExpanded: (value: string) => void;
}

const SideBegrunnelseForm = ({
  innhaldstype,
  sideBegrunnelse,
}: SideBegrunnelseFormProps) => {
  return (
    <div className={classes.sideutvalForm}>
      <div className={classes.inputs}>
        <Heading size="xsmall" level={5} spacing>
          Legg til {sanitizeEnumLabel(innhaldstype)}
        </Heading>
        <Textfield
          label="Begrunnelse for sideutvalg"
          value={sideBegrunnelse?.begrunnelse}
        />
        <Textfield label="Url" value={sideBegrunnelse?.url} type="url" />
      </div>
    </div>
  );
};

const AccordionItem = ({
  expanded,
  setExpanded,
  sideBegrunnelseList,
  innhaldstype,
}: AccordionItemProps) => {
  const [items, setItems] = useState<Side[]>(sideBegrunnelseList);

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
          <div>
            {sideBegrunnelseList.length > 0 ? (
              sideBegrunnelseList.map((sbl) => (
                <SideBegrunnelseForm
                  sideBegrunnelse={sbl}
                  innhaldstype={innhaldstype}
                  setExpanded={setExpanded}
                />
              ))
            ) : (
              <SideBegrunnelseForm
                innhaldstype={innhaldstype}
                setExpanded={setExpanded}
              />
            )}
            <TestlabDivider />
            <div className={classes.lagreSideutvalNettside}>
              <Button
                size={ButtonSize.Small}
                variant={ButtonVariant.Outline}
                onClick={() => setExpanded(innhaldstype)}
              >
                Lukk
              </Button>
              <Button size={ButtonSize.Small}>Lagre {sanitizeEnumLabel(innhaldstype)}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SideutvalAccordion = ({ sideutvalLoeysing, innhaldstypeList }: Props) => {
  const [expanded, setExpanded] = useState<string[]>([]);

  const handleSetExpanded = (key: string) => {
    setExpanded((prevExpanded) =>
      prevExpanded.includes(key)
        ? prevExpanded.filter((p) => p !== key)
        : [...prevExpanded, key]
    );
  };

  return (
    <div className={classes.accordion}>
      {sideutvalLoeysing?.sideUtval
        .map((sideutval) => {
          const innhaldstype =
            sideutval.type.egendefinertType || sideutval.type.innhaldstype;
          return (
            <AccordionItem
              key={innhaldstype}
              expanded={expanded.includes(innhaldstype)}
              setExpanded={handleSetExpanded}
              sideBegrunnelseList={sideutval.sideBegrunnelseList}
              innhaldstype={innhaldstype}
            />
          );
        })}
    </div>
  );
};

export default SideutvalAccordion;
