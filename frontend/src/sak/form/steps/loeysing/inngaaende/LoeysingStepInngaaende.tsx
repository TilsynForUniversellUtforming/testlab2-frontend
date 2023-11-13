import { Chip } from '@digdir/design-system-react';
import { Loeysing } from '@loeysingar/api/types';

import VerksemdLoeysingRelationForm from './verksemd-loeysing-relation/VerksemdLoeysingRelationForm';

interface Props {
  loeysingList?: Loeysing[];
}

const LoeysingStepInngaaende = ({ loeysingList }: Props) => {
  return (
    <>
      <div className="sak-loeysing__inngaaende-selection">
        {loeysingList?.map((loeysing) => (
          <Chip.Toggle key={loeysing.id}>{loeysing.namn}</Chip.Toggle>
        ))}
      </div>
      <VerksemdLoeysingRelationForm />
    </>
  );
};

export default LoeysingStepInngaaende;
