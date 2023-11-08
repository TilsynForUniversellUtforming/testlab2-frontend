import ConditionalComponentContainer from '@common/ConditionalComponentContainer';
import { isDefined } from '@common/util/validationUtils';
import { Chip } from '@digdir/design-system-react';
import { Loeysing } from '@loeysingar/api/types';

import VerksemdLoeysingRelationForm from './VerksemdLoeysingRelationForm';

interface Props {
  loeysingList?: Loeysing[];
}

const LoeysingStepInngaaende = ({ loeysingList }: Props) => (
  <ConditionalComponentContainer
    condition={isDefined(loeysingList)}
    conditionalComponent={
      <div className="sak-loeysing__inngaaende-selection">
        {loeysingList?.map((loeysing) => (
          <Chip.Toggle key={loeysing.id}>{loeysing.namn}</Chip.Toggle>
        ))}
      </div>
    }
    otherComponent={<VerksemdLoeysingRelationForm />}
  />
);

export default LoeysingStepInngaaende;
