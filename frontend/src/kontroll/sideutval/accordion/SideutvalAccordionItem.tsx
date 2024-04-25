import { sanitizeEnumLabel } from '@common/util/stringutils';
import { defaultSide, InnhaldstypeKontroll, Side, SideListItem } from '../types';
import { toSideListItem } from '../sideutval-util';
import classes from '../../kontroll.module.css';
import { Accordion } from '@digdir/designsystemet-react';
import SideBegrunnelseForm from '../form/SideBegrunnelseForm';
import { useCallback, useState } from 'react';

interface Props {
  expanded: boolean;
  setExpanded: (value: string) => void;
  sideBegrunnelseList: Side[];
  type: InnhaldstypeKontroll;
  handleRemoveInnhaldstype: (
    innhaldstype: string,
    egendefinertType: string | undefined
  ) => void;
}

const SideutvalAccordionItem = ({
  expanded,
  setExpanded,
  sideBegrunnelseList,
  type,
  handleRemoveInnhaldstype,
}: Props) => {
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
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
};

export default SideutvalAccordionItem;