import { Accordion } from '@digdir/designsystemet-react';
import { useCallback, useState } from 'react';

import classes from '../../kontroll.module.css';
import SideBegrunnelseForm from '../form/SideBegrunnelseForm';
import { toSideListItem } from '../sideutval-util';
import { SideListItem, Sideutval } from '../types';

interface Props {
  expanded: boolean;
  setExpanded: (value: string) => void;
  sideutval: Sideutval[];
  innhaldstypeLabel: string;
  handleRemoveInnhaldstype: (typeId: number, egendefinertType?: string) => void;
}

const SideutvalAccordionItem = ({
  expanded,
  setExpanded,
  sideutval,
  innhaldstypeLabel,
  handleRemoveInnhaldstype,
}: Props) => {
  const [sideList, setSideList] = useState<SideListItem[]>(
    toSideListItem(innhaldstypeLabel, sideutval)
  );

  const handleAddSide = useCallback(() => {
    const side = sideList[0];
    const newSide: Sideutval = {
      ...side,
      url: '',
      begrunnelse: '',
    };
    setSideList((prev) =>
      toSideListItem(innhaldstypeLabel, [...prev, newSide])
    );
  }, [sideutval, innhaldstypeLabel, sideList]);

  const handleRemoveSide = useCallback(
    (key: string) => {
      const filteredList = sideList.filter((sl) => sl.key !== key);
      setSideList(filteredList);
    },
    [innhaldstypeLabel, sideList]
  );

  return (
    <Accordion.Item open={expanded}>
      <Accordion.Header
        level={6}
        onHeaderClick={() => setExpanded(innhaldstypeLabel)}
      >
        {innhaldstypeLabel}
      </Accordion.Header>
      <Accordion.Content className={classes.centered}>
        <div className={classes.typeFormWrapper}>
          <SideBegrunnelseForm
            innhaldstypeLabel={innhaldstypeLabel}
            sideList={sideList}
            setExpanded={setExpanded}
            handleAddSide={handleAddSide}
            handleRemoveSide={handleRemoveSide}
            handleRemoveInnhaldstype={handleRemoveInnhaldstype}
          />
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
};

export default SideutvalAccordionItem;
