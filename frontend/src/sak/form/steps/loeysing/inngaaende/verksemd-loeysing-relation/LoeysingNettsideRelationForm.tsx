import { Accordion } from '@digdir/design-system-react';
import LoeysingNettsideForm from '@sak/form/steps/loeysing/inngaaende/verksemd-loeysing-relation/LoeysingNettsideForm';
import { LoeysingNettsideRelation } from '@sak/types';

interface Props {
  loeysingNettsideRelationList: LoeysingNettsideRelation[];
}

const LoeysingNettsideRelationForm = ({
  loeysingNettsideRelationList,
}: Props) => (
  <Accordion>
    {loeysingNettsideRelationList.map((lnr, index) => (
      <Accordion.Item key={lnr.loeysing.id}>
        <Accordion.Header>{lnr.loeysing.namn}</Accordion.Header>
        <Accordion.Content>
          <LoeysingNettsideForm loeysingNettsideRelation={lnr} index={index} />
        </Accordion.Content>
      </Accordion.Item>
    ))}
  </Accordion>
);

export default LoeysingNettsideRelationForm;
