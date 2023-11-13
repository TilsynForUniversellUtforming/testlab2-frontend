import { Chip } from '@digdir/design-system-react';
import { LoeysingNettsideRelation } from '@sak/types';

import VerksemdLoeysingRelationForm from './verksemd-loeysing-relation/VerksemdLoeysingRelationForm';

interface Props {
  loeysingList?: LoeysingNettsideRelation[];
}

const LoeysingStepInngaaende = ({ loeysingList }: Props) => {
  return (
    <>
      <div className="sak-loeysing__inngaaende-selection">
        {loeysingList?.map((loeysingRelation) => (
          <Chip.Toggle key={loeysingRelation.loeysing.id}>
            {loeysingRelation.loeysing.namn}
          </Chip.Toggle>
        ))}
      </div>
      <VerksemdLoeysingRelationForm />
    </>
  );
};

export default LoeysingStepInngaaende;
