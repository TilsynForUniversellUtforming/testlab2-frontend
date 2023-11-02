import ConditionalComponentContainer from '@common/ConditionalComponentContainer';
import { isDefined } from '@common/util/validationUtils';
import { Chip } from '@digdir/design-system-react';
import { Loeysing } from '@loeysingar/api/types';

import VerksemdLoesyingRelationForm from './VerksemdLoesyingRelationForm';

interface Props {
  loeysingList?: Loeysing[];
}

const LoeysingStepInngaaende = ({ loeysingList }: Props) => (
  <ConditionalComponentContainer
    condition={isDefined(loeysingList)}
    conditionalComponent={loeysingList?.map((loeysing) => (
      <Chip.Toggle key={loeysing.id}>{loeysing.namn}</Chip.Toggle>
    ))}
    otherComponent={<VerksemdLoesyingRelationForm />}
  />
);

export default LoeysingStepInngaaende;
